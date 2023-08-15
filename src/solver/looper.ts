import EventEmitter from 'eventemitter3'

const MIN_DELAY = 2

export class Looper extends EventEmitter {
  private intval?: number

  readonly event = Symbol('trigger')

  constructor (
    private _automatic: boolean,
    private _delay?: number
  ) {
    super()
    if (_automatic) this.startLoop()
  }

  get automatic (): boolean { return this._automatic }

  set automatic (isAutomatic: boolean) {
    clearInterval(this.intval)
    this._automatic = isAutomatic

    if (this._automatic) this.startLoop()
  }

  get delay (): number | undefined { return this._delay }

  set delay (newDelay: number | undefined) {
    clearInterval(this.intval)
    this._delay = newDelay !== undefined && newDelay > MIN_DELAY ? newDelay : MIN_DELAY

    if (this._automatic) this.startLoop()
  }

  trigger (): void {
    this.emit(this.event)
  }

  private startLoop (): void {
    this.trigger()
    this.intval = setInterval(
      this.trigger.bind(this), this.delay
    )
  }
}
