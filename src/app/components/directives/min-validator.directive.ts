import { Directive, Input } from '@angular/core'
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms'

@Directive({
  selector: '[min]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinDirective, multi: true }]
})
export class MinDirective implements Validator {

  @Input() min: number;

  validate(control: AbstractControl): { [key: string]: any } { 
	  alert(this.min) 
	if (this.min == null ) {
		return;
	}
    return Validators.min(this.min)(control);    
  }
}