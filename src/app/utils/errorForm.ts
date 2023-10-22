import { FormGroup } from "@angular/forms";

export class ErrorForm {

  static get(frm: FormGroup, field: string): string {

    if (!frm) return ''

    let error = ''

    const control = frm.get(field)

    if (control?.valid) {
      return error
    }

    if ((control?.touched || control?.dirty) && control.errors) {

      if (control.errors['required']) {
        error = '¡Campo requerido!'
      } else if (control.errors['email']) {
        error = '¡Email inválido!'
      } else if (control.errors['pattern']) {
        error = '¡Formato de la información ingresada no es correcta!';
      } else if (control.errors['maxlength']) {
        error = `¡Máx. longitud (${control.errors['maxlength'].requiredLength})!`;
      } else if (control.errors['minlength']) {
        error = `¡Min. longitud (${control.errors['minlength'].requiredLength})!`;
      }
    }

    return error;
  }
}