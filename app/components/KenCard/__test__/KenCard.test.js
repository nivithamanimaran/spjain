import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import ReactDOM from "react-dom";
import TestRenderer from "react-test-renderer";
import KenCard from "../index";
import ProvideTheme from "../../../Utils/helper/test/helperFunctions";

afterEach(() => {
  cleanup();
});

//checks that button renders or not
test("KenCard correctly renders", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <ProvideTheme>
      <KenCard />
    </ProvideTheme>,
    div
  );
});

//snapshot testing
it("matches snapshots", () => {
  const tree = TestRenderer.create( <ProvideTheme>
    <KenCard title="Title" /></ProvideTheme>).toJSON();
  expect(tree).toMatchSnapshot();
});
//testing with label
