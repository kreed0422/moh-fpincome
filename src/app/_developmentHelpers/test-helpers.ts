import { DebugElement, Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function getDebugInlineError(de: DebugElement) {
  const _de = de.nativeElement.querySelector('common-error-container');
  // console.log( '_de: ', _de );
  return _de ? _de.textContent : null;
}

export function getDebugElement(
  fixture: ComponentFixture<any>,
  componentHtml: string,
  name: string = null
) {
  const _selector = name
    ? componentHtml + '[name=' + name + ']'
    : componentHtml;
  return fixture.debugElement.query(By.css(_selector));
}

export function getAllDebugElements(
  fixture: ComponentFixture<any>,
  componentHtml: string
) {
  return fixture.debugElement.queryAll(By.css(componentHtml));
}

export function setInput(de: DebugElement, name: string, value: any) {
  let _de = de.nativeElement.querySelector('input[name=' + name + ']');
  if (!_de) {
    // Inputs that use 'value' instead of 'ngModel'
    _de = de.nativeElement.querySelector('input[id=' + name + ']');
  }
  _de.focus();
  _de.value = value;
  _de.dispatchEvent(new Event('input'));
  _de.dispatchEvent(new Event('change'));
  _de.dispatchEvent(new Event('blur'));
}

export function clickRadioButton(de: DebugElement, value: string) {
  const _de = de.query(By.css('input[value=' + value + ']'));
  _de.nativeElement.click();
}
