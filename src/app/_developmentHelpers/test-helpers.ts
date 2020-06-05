import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}

export function getInputDebugElement(de: DebugElement, name: string) {
  let _de = de.nativeElement.querySelector('input[name=' + name + ']');
  if (!_de) {
    // Inputs that use 'value' instead of 'ngModel'
    _de = de.nativeElement.querySelector('input[id=' + name + ']');
  }
  return _de;
}

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
