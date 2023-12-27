import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

const acceptedMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const testFormatFile = (format = "") => {
  return acceptedMimeType.includes(format)
}

export default class NewBill {

  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {
    e.preventDefault()

    const input = this.document.querySelector(`input[data-testid="file"]`)
    const file = input.files[0]
    const fileName = file.name

    this.goodFormatFile = testFormatFile(file?.type)

    if (this.goodFormatFile) {
      const formData = new FormData()
      // ERREUR ICI
      // const email = localStorage.getItem("user").email
      const email = JSON.parse(localStorage.getItem("user")).email
      formData.append('file', file)
      formData.append('email', email)
      this.formData = formData
      this.fileName = fileName

      input.classList.remove("is-invalid");
      input.classList.add("blue-border");
    } else {
      console.log("mauvais mime type")
      this.fileName = null;
      this.fileUrl = null;

      if ("DataTransfer" in globalThis) {
        const dt = new globalThis.DataTransfer()
        input.files = dt.files
      }
      input.type = "text"
      delete input.files
      input.value = ""
      input.type = "file"
      input.classList.add("is-invalid");
      input.classList.remove("blue-border");

      alert(`mauvais format : votre fichier est au format => ${file.type} alors que les formats autorisés sont : ${acceptedMimeType.join(' ')}`);
      //throw new Error(`mauvais mime type : ${file?.type}`)

    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log("submit new bill ", this.fileName, " ", this.fileUrl)
    //if (this.fileName != null && this.fileUrl != null) {
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const user = JSON.parse(localStorage.getItem("user"))
    const email = user.email
    console.log("email : ", email)
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    console.log('bill handle submit : ', bill)

    if (this.goodFormatFile) {
      console.log('handle submit good format file : ', this.formData)

      this.store
        .bills()
        .create({
          data: this.formData,
          headers: {
            noContentType: true,
          },
        })
        .then((res) => {
          console.log("res", res)
          const { fileUrl, key, filePath } = res
          console.log("file url", fileUrl ?? filePath)
          console.log("key ", key)
          this.billId = key
          this.fileUrl = fileUrl ?? filePath
        })
        .then(() => {
          this.updateBill(bill);
        })
        .catch((error) => console.error(error));
    }
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    console.log("update bill : ", this.billId)
    console.log("bill : ", bill)
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch(error => console.error(error))
    }
  }
}