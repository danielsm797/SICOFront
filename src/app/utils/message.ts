import Swal from 'sweetalert2'

export const message = (title: string, text: string, success: boolean) => {

  Swal.fire({
    title,
    text,
    icon: success ? 'success' : 'error',
    confirmButtonText: 'Aceptar'
  })
}

export const question = async (title: string, text: string,) => {

  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    confirmButtonText: 'Aceptar',
    showCancelButton: true
  })

  return result.value
}