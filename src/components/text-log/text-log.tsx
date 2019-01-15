import {
  Component,
  Method,
  State,
} from '@stencil/core';

@Component({
  tag: 'rl-text-log',
  styleUrl: 'text-log.scss',
})

export class RLTextLog {

  @State() strings: string[] = [];

  /**
   * Add a new line to the log.
   * @param str A string to write to the log
   */
  @Method()
  log(str = '') {
    this.strings = [ ...this.strings, str ];
  }

  hostData() {
    return {
      class: {
        'rl-text-log': true,
      }
    };
  }

  render() {
    return this.strings.map(s =>
      <div>{s}</div>
    );
  }
}
