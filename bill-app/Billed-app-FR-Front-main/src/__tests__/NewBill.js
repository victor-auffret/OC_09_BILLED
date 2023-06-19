/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


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

      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();

    })
  })
})
