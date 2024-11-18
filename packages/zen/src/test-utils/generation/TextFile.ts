import * as _ from 'lodash'
import * as fs from 'fs'
import * as c from 'ansi-colors'
import * as upath from 'upath'
import { LogZenMini } from '../../code/LogZenMini'
import { ISubstituteOptionsAndState } from './types'

const l = new LogZenMini('TextFile')

// @todo: improve - this was a 1-day hack - not the best design but what it does is what matters!

export class TextFile {
  private lastModified: number = 0
  // private isChanged = false
  private _text: string = ''
  private _lastSavedText: string = ''

  private constructor(
    public fullFilename: string,
    public o: ISubstituteOptionsAndState,
    public memoryOnly: boolean = false
  ) {
    // in memory only otherwise, it can be read() or save() later
  }

  get filename() {
    return upath.basename(this.fullFilename)
  }

  get relativeFilename() {
    return upath.relative(this.o.resolvedWorkDir, this.fullFilename)
  }

  // Text is the current & possibly unsaved text (like opening a new file in an editor)
  get text() {
    return this._text
  }

  set text(newText: string) {
    this._text = newText
    // if (this._text !== newText) {
    //   this.isChanged = true
    //   this._text = newText
    // } else {
    //  this.o.l.silly(`text = '...' No changes in file ${this.filename}`)
    // }
  }

  read() {
    if (this.memoryOnly) {
      this.o.l.debug(`NOT reading "${c.blueBright(this.relativeFilename)}" - Memory only`)
      return
    }

    if (this.text !== this._lastSavedText) {
      throw new Error(`Cannot read file ${this.fullFilename} - it has unsaved changes!`)
    } else {
      const lastModified = fs.statSync(this.fullFilename).mtimeMs
      if (lastModified > this.lastModified) {
        this.o.l.debug(`Reading file: ${this.relativeFilename}`)
        this._lastSavedText = this._text = fs.readFileSync(this.fullFilename, 'utf8')
        this.lastModified = lastModified
      } else
        this.o.l.debug(
          `NOT Reading File ${this.relativeFilename} - has not changed since last read!`
        )
    }
  }

  save() {
    if (this.memoryOnly) {
      this.o.l.debug(`NOT Saving "${c.blueBright(this.relativeFilename)}" - Memory only`)
      return
    }

    if (this.isChanged) {
      if (!this.o.dryRun) {
        if (!this.isExists) {
          l.notice(`Creating file: ${this.relativeFilename}`)
          fs.mkdirSync(upath.dirname(this.fullFilename), { recursive: true })
        }
        fs.writeFileSync(this.fullFilename, this._text, 'utf8')
        this._lastSavedText = this._text
        this.lastModified = fs.statSync(this.fullFilename).mtimeMs
      }
      const msg = `Saved file: "${c.blueBright(this.relativeFilename)}"` // ${substitutionLabel} => ${substitution.extractedText}
      this.o.l.info((this.o.dryRun ? 'DryRun:' : '') + msg)
    } else
      this.o.l.debug(`NOT Saving "${c.blueBright(this.relativeFilename)}" - no changes to save`)
  }

  get isExists() {
    if (this.memoryOnly) {
      this.o.l.debug(
        `NOT checking isExists "${c.blueBright(this.relativeFilename)}" - Memory only`
      )
      return true
    }

    return fs.existsSync(this.fullFilename)
  }

  get isChanged() {
    if (this.memoryOnly) {
      this.o.l.debug(
        `NOT checking isChanged "${c.blueBright(this.relativeFilename)}" - Memory only`
      )
      return false
    }

    return this._lastSavedText !== this._text
  }

  // Keeps a registry of files opened, by filename
  // If a file is already open, returns the instance
  // If not, creates a new instance and returns it
  static getFile(
    filename: string,
    options: ISubstituteOptionsAndState,
    memoryOnly: boolean = false
  ): TextFile {
    return (TextFile.files[filename] ||= new TextFile(filename, options, memoryOnly))
  }

  // Registry of opened files
  static files: { [filename: string]: TextFile } = {}

  static saveAll() {
    let saveCount = 0
    _.each(TextFile.files, (file) => {
      if (!file.isExists || file.isChanged) {
        file.save()
        saveCount++
      }
    })
    return saveCount
  }
}
