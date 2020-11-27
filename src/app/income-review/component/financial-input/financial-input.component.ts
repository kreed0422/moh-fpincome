import { Component, forwardRef, Input, OnInit, Self } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'fpir-financial-input',
  templateUrl: './financial-input.component.html',
  styleUrls: ['./financial-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FinancialInputComponent),
      multi: true,
    },
  ],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(blur)': '_onTouched()',
  },
})
export class FinancialInputComponent implements OnInit, ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() moneyMask: any = null;

  _value: number = null;
  _textMask: any;

  // Required for implementing ControlValueAccessor
  _onChange = (_: any) => {};
  _onTouched = (_?: any) => {};

  decimalPipeMask = (value: any) => {
    if (!isNaN(value)) {
      return Number(value).toFixed(2);
    }
    return value;
    // tslint:disable-next-line: semicolon
  };

  constructor() {}

  ngOnInit() {
    this._textMask = { pipe: this.decimalPipeMask };

    if (this.moneyMask) {
      this._textMask = Object.assign(this._textMask, { mask: this.moneyMask });
    }
  }

  // Required for implementing ControlValueAccessor
  writeValue(value: any): void {
    console.log('value: ', value);
    if (value !== null && value !== undefined) {
      this._value = value;
    }
  }

  // Register change function
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  // Disable control
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
