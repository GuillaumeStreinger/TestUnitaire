import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import OrderStats from "./components/OrderStats";
import { sendGetRequest } from "./lib/http";

jest.mock("./lib/http", () => {
  return {
    sendGetRequest: jest.fn((url) => {
      if (url === '/api/articles') {
        return Promise.resolve({
          articles: [
            { id: "1234", name: "Chaise", priceEur: 50 },
            { id: "5678", name: "Table", priceEur: 150 },
          ],
        });
      } else if (url === '/orders/stats') {
        return Promise.resolve({
          "2023-5": 240,
          "2023-6": 120
        });
      }
      return Promise.resolve({});
    }),
  };
});

describe("App", () => {
  it("renders loading status first and articles after fetching data", async () => {
    render(<App />);

    const loadingElement = screen.getByText(/Chargement…/i);
    expect(loadingElement).toBeInTheDocument();

    let articleElements: HTMLElement[];
    await waitFor(() => {
      articleElements = screen.getAllByRole("listitem");
      expect(articleElements).toHaveLength(2);
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("Chaise");
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("0");
    });

    await waitFor(() => {
      const buttons = within(articleElements[0]).getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("-");
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("+");
    });
  });

  describe("when button + is clicked", () => {
    it("increments count", async () => {
      render(<App />);

      let articleElements: HTMLElement[];
      await waitFor(() => {
        articleElements = screen.getAllByRole("listitem");
        const buttonPlus = within(articleElements[0]).getByText("+");

        buttonPlus.click();
        expect(articleElements[0].textContent).toMatch("1");
      });

      await waitFor(() => {
        expect(articleElements[1].textContent).toMatch("0");
      });
    });
  });

  describe("App with OrderStats", () => {
    it("renders OrderStats with correct data", async () => {
      render(<App />);
  
      // Test pour vérifier que les statistiques sont affichées après le chargement
      await waitFor(() => {
        expect(screen.getByText("2023-5: 240€")).toBeInTheDocument();
        expect(screen.getByText("2023-6: 120€")).toBeInTheDocument();
      });
    });
  });
});