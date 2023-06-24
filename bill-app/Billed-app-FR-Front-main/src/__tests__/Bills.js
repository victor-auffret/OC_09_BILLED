/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js"
import BillsContainer from "../containers/Bills.js";
import { formatDate, formatStatus } from "../app/format.js"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
      // icon highlight
      expect(windowIcon.classList.contains("active-icon")).toBe(true)

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

  })

  describe("When i click on new bills button", () => {
    test("Then i should navigate on new bills page", () => {

      let path = ""

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
        path = pathname
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })

      const billsTest = new BillsContainer({ document, onNavigate, localStorage })
      const handleClickNewBills = jest.fn(billsTest.handleClickNewBill)

      const buttonNewBills = screen.getByTestId("btn-new-bill")
      expect(buttonNewBills).toBeTruthy()

      buttonNewBills.addEventListener("click", handleClickNewBills)

      fireEvent.click(buttonNewBills)

      expect(handleClickNewBills).toHaveBeenCalled()

      expect(path).toBe(ROUTES_PATH['NewBill'])

    })
  })

  describe("When i try to get bills", () => {
    test("Then i should get bills with format date", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
        path = pathname
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })

      const billsTest = new BillsContainer({ document, onNavigate, store, localStorage })

      let result = null

      const handleGetBills = jest.fn(async () => {
        await billsTest.getBills().then(r => result = r)
      })

      const table = screen.getByTestId("tbody")
      expect(table).toBeTruthy()

      table.addEventListener("load", handleGetBills)

      fireEvent.load(table)

      expect(handleGetBills).toHaveBeenCalled()

      await waitFor(billsTest.getBills)
      expect(result.length).toBe(4)

      const DATES = [
        "4 Avr. 04",
        "1 Jan. 01",
        "3 Mar. 03",
        "2 Fév. 02"
      ]

      let data = await store.bills().list()

      await waitFor(store.bills)

      expect(data.length).toBe(4)

      const VALID_STATUS = [
        "pending",
        "accepted",
        "refused"
      ]

      for (let i = 0; i < result.length; i++) {
        expect(result[i].date).toBe(DATES[i])
        expect(result[i].date).toBe(formatDate(data[i]["date"]))
        expect(VALID_STATUS.includes(data[i]["status"])).toBeTruthy()
        expect(result[i].status).toBe(formatStatus(data[i]["status"]))
      }

    })
  })


  describe("When i'm on bills page and i click on eye button", () => {
    test("Then the modale open", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      document.body.innerHTML = BillsUI({ data: bills })

      const billsTest = new BillsContainer({ document, onNavigate, localStorage })

      await waitFor(() => screen.getAllByTestId("icon-eye"))

      const eyeButtons = screen.getAllByTestId("icon-eye")
      expect(eyeButtons).toBeTruthy()

      expect(eyeButtons.length).toBe(4)

      //await waitFor(() => screen.getByTestId("bills-modale"))

      for (let i = 0; i < eyeButtons.length; i++) {
        const eyeButton = eyeButtons[i]
        expect(eyeButton).toBeTruthy()

        const billUrl = eyeButton.getAttribute("data-bill-url")
        expect(billUrl).toBeTruthy()
        let url = ""

        const handleClickIconEye = jest.fn(async () => {
          billsTest.handleClickIconEye(eyeButton)
          url = eyeButton.getAttribute("data-bill-url")
        })

        eyeButton.addEventListener("click", handleClickIconEye)

        // bootstrap présent dans le index.html mais 
        // manquant dans le package.json => erreur

        fireEvent.click(eyeButton)

        expect(handleClickIconEye).toHaveBeenCalled()

        //await waitFor(handleClickIconEye)

        expect(url).toBe(billUrl)

      }

    })
  })


})
