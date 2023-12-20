import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

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
    //const filePath = e.target.value.split(/\\/g)
    const fileName = file.name // filePath[filePath.length - 1]
    const formData = new FormData()
    const email = localStorage.getItem("user").email
    formData.append('file', file)
    formData.append('email', email)

    const acceptedMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    //const acceptExt = ["jpg", "jpeg", "png", "gif"]
    // acceptExt.findIndex(ext => file?.fileName?.endsWith(ext)) >= 0

    console.log("TEST FILE TYPE : ", file?.type)

    if (acceptedMimeType.includes(file?.type)) {
      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then((res) => {
          console.log("res", res)
          const { fileUrl, /*fileName,*/ key, filePath } = res
          //const { fileUrl, key } = res
          console.log("file url", fileUrl ?? filePath)
          console.log("key ", key)
          this.billId = key
          this.fileUrl = fileUrl ?? filePath
          //this.fileUrl = filePath
          this.fileName = fileName
        }).catch(console.error)
    } else {

      console.log("mauvais mime type")
      this.fileName = null;
      this.fileUrl = null;
      if ("DataTransfer" in globalThis) {
        const dt = new globalThis.DataTransfer()
        input.files = dt.files
      }
      //input.files = []
      input.type = "text"
      delete input.files
      input.value = ""
      input.type = "file"
      // throw new Error("mauvais format : " + JSON.stringify(e) + " file => " + file.type)
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log("submit new bill ", this.fileName, " ", this.fileUrl)
    //if (this.fileName != null && this.fileUrl != null) {
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const user = localStorage.getItem("user")
    const email = JSON.parse(user).email
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
    console.log("submit new bill NO")
    if (!this.fileName) return;
    console.log("submit new bill OK")
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
    //}
    console.log("submit new bill NO")
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
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