//import $ from "jquery"

import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    // ajout :
    /*
    const billFileName = icon.getAttribute("data-bill-fileName")
    const separate_url = billFileName.split(".")
    const ext = separate_url[separate_url.length - 1]
    const ext_ok = ["png", "jpg", "jpeg", "gif"].includes(ext)
    */
    const img_is_ok = true
    const image = img_is_ok ? `<img class="img-justificatif" width=${imgWidth} src=${billUrl} alt="Bill ${billUrl}" />` : "pas de justificatif"
    $('#modaleFile')
      .find(".modal-body")
      .html(`<div class="bill-proof-container">${image}</div>`)
    // .html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    let elem = $('#modaleFile')
    if ('modal' in elem) {
      elem.modal('show')
    }

  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => {
              try {
                return {
                  ...doc,
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status)
                }
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, 'for', doc)
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status)
                }
              }
            })
          console.log('length', bills.length)
          return bills
        })
    }
    // ajout : 
    return false
  }
}
