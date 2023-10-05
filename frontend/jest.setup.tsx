import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

jest.mock("axios");

jest.useFakeTimers({ legacyFakeTimers: true });

jest.setTimeout(30000);

configure({ defaultHidden: true });
