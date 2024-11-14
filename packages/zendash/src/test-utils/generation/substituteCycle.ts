import * as _ from 'lodash'
import * as fs from 'node:fs'
import * as upath from 'upath'
import { clean } from './clean'
import * as c from 'ansi-colors'
import { getFinalConfig } from './getFinalConfig'
import { LogZenMini } from '../../code/LogZenMini'
import { TextFile } from './TextFile'
import { ISubstituteOptionsAndState } from './types'

export const substituteCycle = async (o: ISubstituteOptionsAndState) => {
  try {
    o.l.debug('Starting substituteCycle()')

    const startTimeMillis = Date.now()
    o.cycles = o.cycles + 1

    // cleaning if needed, 1st time only
    if (!_.isEmpty(o.clean) && o.cycles === 1) await clean(o)

    // validate dirs exist
    if (!fs.existsSync(o.resolvedWorkDir))
      throw new Error(`Substitution 'workDir' not found: ${o.resolvedWorkDir}`)
    if (!fs.existsSync(o.resolvedTemplatesDir))
      throw new Error(`Substitution 'templatesDir' not found: ${o.resolvedTemplatesDir}`)

    for (const key in o.substitutions) {
      if (!o.substitutions[key].sourceFile.isExists)
        throw new Error(
          `Substitution '${key}' not found. File "${o.substitutions[key].sourceFile.fullFilename}" missing`
        )
    }

    // create output dir if not exists
    if (!fs.existsSync(o.resolvedOutputDir)) {
      o.l.info(`Creating output dir: ${c.blueBright(o.resolvedOutputDir)}`)
      fs.mkdirSync(o.resolvedOutputDir, { recursive: true })
    }

    o.l.silly(`o.substitutions`, o.substitutions)

    let newRun = true
    // for each substitution, read the file, replace the placeholders, write the file
    for (const substitutionLabel in o.substitutions) {
      const substitution = o.substitutions[substitutionLabel]
      // if (!(substitution.extractedText && substitution.sourceFile.text)) {
      const { sourceFile } = substitution
      sourceFile.read()

      // Extract the text between the 2 substitutionLabel markers in the fileContents (eg `// {{label}} someCodeHere // {{label}}`)
      // Error out if not found, ot if more than is 1 found
      const regExpString =
        o.markerStart +
        '\\s*?' +
        substitutionLabel +
        '\\s*?' +
        'BEGIN' +
        '\\s*?' +
        o.markerEnd +
        '([\\s\\S]*?)' +
        o.markerStart +
        '\\s*?' +
        substitutionLabel +
        '\\s*?' +
        'END' +
        '\\s*?' +
        o.markerEnd

      // check for no match or >1 match
      let matches = sourceFile.text.match(new RegExp(regExpString, 'g'))
      // prettier-ignore
      if (!matches) throw new Error(`No match found for substitutionLabel: \`${c.yellow(substitutionLabel)}\`. It looks for ${c.green(o.markerStart)} ${c.yellow(substitutionLabel)} BEGIN ${c.green(o.markerEnd)} .... ${c.green(o.markerStart)} ${c.yellow(substitutionLabel)} END ${c.green(o.markerEnd)}`)
        else if (matches.length > 1) throw new Error(`More than 1 match found for substitutionLabel: ${c.green(o.markerStart)} ${c.yellow(substitutionLabel)} BEGIN/END ${c.green(o.markerEnd)}`) // @todo: check existence of either BEGIN / END solo & throw

      // actually extract the text
      if ((matches = sourceFile.text.match(new RegExp(regExpString))))
        substitution.extractedText = o.trimExtractedText ? _.trim(matches[1]) : matches[1]
      // }

      // Use the extracted text, as substitution for the marker(s) found in each template file
      if (substitution.extractedText) {
        // Get all template files in the templatesDir
        const templateFiles = fs.readdirSync(o.resolvedTemplatesDir)
        // For each template file, read & replace
        for (const templateFilename of templateFiles) {
          // only if it's a file, not dir
          if (!fs.statSync(upath.join(o.resolvedTemplatesDir, templateFilename)).isFile())
            continue

          const templateFile = TextFile.getFile(
            `${o.resolvedTemplatesDir}/${templateFilename}`,
            o
          )
          templateFile.read()

          if (o.templatesFilter) {
            if (_.isFunction(o.templatesFilter)) {
              if (!o.templatesFilter(templateFilename, templateFile.text)) {
                o.l.verbose(
                  `Skipping file (templatesFilter) "${c.blueBright(templateFilename)}"`
                )
                continue
              }
            } else
              throw new Error(
                'Substitute: `templatesFilter` must be a function `(filename, text) => boolean`'
              )
          }

          // What to name the generated file
          let generatedFileName = templateFilename // default
          if (!!o.renameOutputFile) {
            if (_.isFunction(o.renameOutputFile)) {
              generatedFileName = o.renameOutputFile(
                upath.trimExt(generatedFileName),
                upath.extname(generatedFileName).slice(1)
              )
            } else
              throw new Error(
                'Substitute: `renameOutputFile` must be a function `(filenameNoExt, ext) => string`'
              )
          }

          // generatedFile might already exist, if it was generated before for another substitution, in same or previous run
          const generatedFile = TextFile.getFile(
            `${o.resolvedOutputDir}/${generatedFileName}`,
            o
          )

          if (newRun) {
            if (generatedFile.isExists) generatedFile.read() // so we can save saving, if no changes
            generatedFile.text = templateFile.text // initial text is template
          }

          generatedFile.text = generatedFile.text.replace(
            new RegExp(
              o.markerStart + '\\s*?' + '@' + substitutionLabel + '\\s*?' + o.markerEnd,
              'g'
            ),
            (o.bannerStart ? o.bannerStart + ' `' + substitutionLabel + '`\n' : '') +
              substitution.extractedText +
              (o.bannerEnd ? o.bannerEnd + ' `' + substitutionLabel + '`\n' : '')
          )

          generatedFile.text = o.replaceInOutputFile(generatedFileName, generatedFile.text)
        }
      } else {
        throw new Error(`No extracted text for substitutionLabel: ${substitutionLabel}`)
      }

      newRun = false
    }

    const saveCount = TextFile.saveAll()
    // prettier-ignore
    o.l.ok(`Done cycle #${o.cycles}. ${saveCount ? 'Saved ' + c.yellow(`${saveCount} changed files`) : c.yellow('NOT Saved any files (no changes)')
    } in ${Date.now() - startTimeMillis}ms`)
  } catch (error: any) {
    o.l.error(`Error in generate():`, error.message)
    // prettier-ignore
    if (o.watch) o.l.warn(`NOT EXITING: generate() should continue watching for changes, but will not regenerate until the error is fixed!`)
    else throw error
  }
}
