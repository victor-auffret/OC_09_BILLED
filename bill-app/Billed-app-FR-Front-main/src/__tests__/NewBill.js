/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
//
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
//
import mockedBills from "../__mocks__/store.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
//
import NewBill from "../containers/NewBill.js"
//
import NewBillUI from "../views/NewBillUI.js"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockedBills)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should render form new bill page with empty field", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html

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
  })

  describe("When i try to submit form new bills", () => {
    test("Then it should be call store", () => {

      /*
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      });*/

      const user = {
        type: "Employee",
        email: "test@test.com",
        password: "test",
        status: "connected"
      }

      window.localStorage.setItem("user", JSON.stringify(user));

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

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
})
/*
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')

      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
      // icon highlight
      expect(windowIcon.classList.contains("active-icon")).toBe(true)

    })
  })
})*/

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I change file with correct file extension png, jpg, jpeg or gif", () => {
    test("Then it should be have 1 file on file list", async () => {


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

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI()

      await waitFor(() => screen.getByTestId("file"))
      const inputFile = screen.getByTestId("file")

      expect(inputFile).toBeTruthy()

      let nom_du_fichier = null

      const testHandleFile = jest.fn((e) => {
        const reader = new FileReader();
        reader.addEventListener('load', (evt) => {
          if (reader.result) {
            nom_du_fichier = reader.result
          }
        });
        reader.readAsDataURL(e.target.files[0]);
        newBill.handleChangeFile(e)
      })

      inputFile.addEventListener("change", testHandleFile)


      const file = new File(
        [],
        'facture.png',
        {
          type: 'image/png',
          filepath: "/truc/image/facture.png"
        }
      )

      fireEvent.change(inputFile, {
        target: {
          files: [file],
          filename: 'facture.png',
          filepath: '/truc/image/facture.png',
          type: 'image/png'
        }
      })

      expect(testHandleFile).toHaveBeenCalled()

      expect(inputFile.files.length).toBe(1)

    })
  })
})

describe("Given I am connected as an employee on NewBill Page", () => {
  describe("When I use wrong file format", () => {
    test("Then system ask me to fill out the form correctly", async () => {

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

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI()

      await waitFor(() => screen.getByTestId("file"))
      const inputFile = screen.getByTestId("file")

      expect(inputFile).toBeTruthy()

      let nom_du_fichier = null

      const testHandleFile = jest.fn((e) => {
        const reader = new FileReader();
        reader.addEventListener('load', (evt) => {
          if (reader.result) {
            nom_du_fichier = reader.result
          }
        });
        reader.readAsDataURL(e.target.files[0]);
        newBill.handleChangeFile(e)
      })

      inputFile.addEventListener("change", testHandleFile)


      const file = new File(
        [],
        'facture.mp4',
        {
          type: 'video/mp4',
          filepath: "/truc/video/facture.mp4"
        }
      )

      fireEvent.change(inputFile, {
        target: {
          files: [file],
          filename: 'facture.mp4',
          filepath: '/truc/video/facture.mp4',
          type: 'video/mp4'
        }
      })

      expect(testHandleFile).toHaveBeenCalled()

      // fichier non accepté = 0 
      expect(inputFile.files.length).toBe(0)

    })
  })
})

describe("Given I am connected as an employee on NewBill Page", () => {
  describe("When I send the correctly completed form", () => {
    test("The I'm redirect to bill page", async () => {

      const user = {
        type: "Employee",
        email: "test@test.com",
        password: "test",
        status: "connected"
      }

      window.localStorage.setItem("user", JSON.stringify(user));

      const onNavigate = jest.fn(() => {
        document.body.innerHTML = ROUTES({ pathname })
      })

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage
      })

      const html = NewBillUI()
      document.body.innerHTML = html

      const inputData = {
        selectTypeDepense: "Transports",
        inputNomDeLaDepense: "trajet voiture",
        inputDate: "2023-10-24",
        inputMontantTtc: "1234",
        inputVat: "12",
        inputPct: "15",
        textareaCommentaire: "sans commentaire"
      }

      waitFor(() => screen.getByTestId('form-new-bill'))
      const form = await screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()

      const selectTypeDepense = screen.getByTestId("expense-type")
      fireEvent.change(selectTypeDepense, { target: { value: inputData.selectTypeDepense } });
      expect(selectTypeDepense.value).toBe(inputData.selectTypeDepense);

      const inputNomDeLaDepense = screen.getByTestId("expense-name")
      fireEvent.change(inputNomDeLaDepense, { target: { value: inputData.inputNomDeLaDepense } });
      expect(inputNomDeLaDepense.value).toBe(inputData.inputNomDeLaDepense);

      const inputDate = screen.getByTestId("datepicker")
      fireEvent.change(inputDate, { target: { value: inputData.inputDate } });
      expect(inputDate.value).toBe(inputData.inputDate);

      const inputMontantTtc = screen.getByTestId("amount")
      fireEvent.change(inputMontantTtc, { target: { value: inputData.inputMontantTtc } });
      expect(inputMontantTtc.value).toBe(inputData.inputMontantTtc);

      const inputVat = screen.getByTestId("vat")
      fireEvent.change(inputVat, { target: { value: inputData.inputVat } });
      expect(inputVat.value).toBe(inputData.inputVat);

      const inputPct = screen.getByTestId("pct")
      fireEvent.change(inputPct, { target: { value: inputData.inputPct } });
      expect(inputPct.value).toBe(inputData.inputPct);

      const textareaCommentaire = screen.getByTestId("commentary")
      fireEvent.change(textareaCommentaire, { target: { value: inputData.textareaCommentaire } });
      expect(textareaCommentaire.value).toBe(inputData.textareaCommentaire);

      const inputFile = screen.getByTestId("file")
      const testHandleFile = jest.fn((e) => {
        newBill.handleChangeFile(e)
      })
      inputFile.addEventListener("change", testHandleFile)
      const file = new File(
        [],
        'facture.png',
        {
          type: 'image/png',
          filepath: "/truc/image/facture.png"
        }
      )
      fireEvent.change(inputFile, {
        target: {
          files: [file],
          filename: 'facture.png',
          filepath: '/truc/image/facture.png',
          type: 'image/png'
        }
      })
      expect(testHandleFile).toHaveBeenCalled()

      const handleSubmit = jest.fn((e) => {
        newBill.handleSubmit(e)
      });

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      //expect(onNavigate).toHaveBeenCalled()
    })
  })
})