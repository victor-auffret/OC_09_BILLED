/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { mockedBills } from "../__mocks__/store.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render form new bill page with empty field", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const selectTypeDepense = screen.getByTestId("expense-type")
      expect(selectTypeDepense.value).not.toBe("")

      const inputNomDeLaDepense = screen.getByTestId("expense-name")
      expect(inputNomDeLaDepense.value).toBe("")

      const inputDate = screen.getByTestId("datepicker")
      expect(inputDate.value).toBe("")

      const inputMontantTtc = screen.getByTestId("amount")
      expect(inputMontantTtc.value).toBe("")

      const inputVat = screen.getByTestId("vat")
      expect(inputVat.value).toBe("")

      const inputPct = screen.getByTestId("pct")
      expect(inputPct.value).toBe("")

      const textareaCommentaire = screen.getByTestId("commentary")
      expect(textareaCommentaire.value).toBe("")

      const inputFile = screen.getByTestId("file")
      expect(inputFile.value).toBe("")

      waitFor(() => screen.getByTestId('form-new-bill'))
      const form = await screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()

      const handleSubmit = jest.fn(() => { });

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();

    })

    describe("When i try to submit form", () => {
      test("Then it should be call store", () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: jest.fn(() => null),
            setItem: jest.fn(() => null),
          },
          writable: true,
        });

        /*
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee",
          email: "test@test.com",
          password: "test",
          status: "connected"
        }))*/

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage
        })

        document.body.innerHTML = NewBillUI()

        const form = screen.getByTestId("form-new-bill")
        expect(form).toBeTruthy()

        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();

      })
    })


    describe("When i try to add file img with bad extension", () => {
      test("Then it should render empty file input", async () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const user = {
          type: "Employee",
          email: "test@test.com",
          password: "test",
          status: "connected"
        }

        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: jest.fn(() => {
              return JSON.stringify(user)
            }),
            setItem: jest.fn(() => null),
          },
          writable: true,
        });

        const a_tester = window.localStorage.getItem("user")
        expect(a_tester).toBe(JSON.stringify(user).toString())

        expect(JSON.parse(a_tester).email).toBe(user.email)

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage
        })

        document.body.innerHTML = NewBillUI()

        const inputFile = screen.getByTestId("file")

        expect(inputFile).toBeTruthy()

        const handleChange = jest.fn(e => newBill.handleChangeFile(e))

        inputFile.addEventListener("change", handleChange)

        fireEvent.change(inputFile, {
          dataTransfer: {
            files: [new File(['song.mp3'], 'song.mp3', { type: 'audio/mp3' })],
          }
        })

        expect(handleChange).toHaveBeenCalled()

        expect(inputFile.value).toBe('')

        expect(inputFile.files.length).toBe(0)

      })
    })
  })
})
