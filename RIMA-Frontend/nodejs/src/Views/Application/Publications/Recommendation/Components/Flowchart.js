import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";

import CytoscapeComponent from "react-cytoscapejs";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import popper from "cytoscape-popper";

const minZoom = 0.5;
const maxZoom = 1e1;

export default function Flowchart(props) {
  // start Tannaz
  cytoscape.use(popper);
  const { elements, height, xStartPoint, yStartPoint } = props;
  return (
    <div
      style={{ display: "flex", flex: 1, height: height, maxWidth: "600px" }}
    >
      <CytoscapeComponent
        cy={(cy) => {
          cy.on("resize", (_evt) => {
            cy.layout({
              name: "preset",
              spacingFactor: 1,
              avoidOverlap: true,
              fit: true,
              padding: 10,
              animate: true,
              animationDuration: 500,
            }).run();

            // it is nicer but is too slow
            // cy.elements().forEach(function (ele) {
            //   if (ele._private.data.tooltip != undefined) {
            //     makePopperWithTippy(ele);
            //   }
            // });
            // console.log("id2tip = ", id2tip);
          });

          // var id2tip = {};

          // let makePopperWithTippy = (node) => {
          //   let ref = node.popperRef(); // used only for positioning

          //   // A dummy element must be passed as tippy only accepts dom element(s) as the target
          //   // https://atomiks.github.io/tippyjs/v6/constructor/#target-types
          //   let dummyDomEle = document.createElement("div");

          //   let tip = tippy(dummyDomEle, {
          //     // tippy props:
          //     getReferenceClientRect: ref.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
          //     trigger: "manual", // mandatory, we cause the tippy to show programmatically.

          //     // your own custom props
          //     // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
          //     content: () => {
          //       let content = document.createElement("div");

          //       content.innerHTML = node.id();

          //       return content;
          //     },
          //   });
          //   id2tip[node.id()] = tip;
          // };

          // cy.nodes().unbind("mouseover");
          // cy.nodes().bind("mouseover", (event) => {
          //   if (event.target._private.data.tooltip != undefined) {
          //     console.log("id = ", event.target.id());
          //     id2tip[event.target.id()].show();
          //   }
          // });

          // cy.nodes().unbind("mouseout");
          // cy.nodes().bind("mouseout", (event) => {
          //   if (event.target._private.data.tooltip != undefined) {
          //     console.log("id = ", event.target.id());
          //     id2tip[event.target.id()].hide();
          //   }
          // });

          // it works:
          cy.elements().unbind("mouseover");
          cy.elements().bind("mouseover", (event) => {
            if (event.target._private.data.tooltip != undefined) {
              event.target.popperRefObj = event.target.popper({
                content: () => {
                  let content = document.createElement("div");

                  content.classList.add("popper-div");

                  content.innerHTML = event.target._private.data.tooltip;

                  document.body.appendChild(content);
                  return content;
                },
              });
            }
          });

          cy.elements().unbind("mouseout");
          cy.elements().bind("mouseout", (event) => {
            if (event.target._private.data.tooltip != undefined) {
              if (event.target.popper) {
                event.target.popperRefObj.state.elements.popper.remove();
                event.target.popperRefObj.destroy();
              }
            }
            cy.on("mouseover", "node", function (evt) {
              document.body.style.cursor = "grab";
            });
          });

          cy.on("mouseout", "node", function (evt) {
            document.body.style.cursor = "default";
          });

          cy.on("mousedown", "node", function (evt) {
            document.body.style.cursor = "grabbing";
          });

          cy.on("mouseup", "node", function (evt) {
            document.body.style.cursor = "grab";
          });
          // cy.on("click", "node", function (evt) {
          //   var ele = evt.target;
          //   ele.style("background-color", "blue");
          // });
        }}
        elements={elements}
        style={{
          width: "100%",
          height: "100%",
          border: "0.5px solid #E7E7E7",
          borderRadius: 8,
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "background-color": "rgba(255, 255, 255, 0)",

              width: "data(width)",
              height: 40,
              "text-background-opacity": 0,
              "text-background-padding": "2px",
              "border-color": "data(faveColor)",
              "border-style": "data(borderStyle)",
              "border-width": 2,
              "border-opacity": 1,
              shape: "data(shape)",
            },
          },
          {
            selector: "node[label]",
            style: {
              label: "data(label)",
              "font-size": "13",
              color: "data(faveColor)",
              "text-halign": "center",
              "text-valign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "data(faveColor)",
              "line-style": "data(lineStyle)",
              "line-color": "data(faveColor)",
              width: 1.5,
            },
          },
          {
            selector: "edge[label]",
            style: {
              label: "data(label)",
              "font-size": "12",

              "text-background-color": "white",
              "text-background-opacity": 1,
              "text-background-padding": "2px",

              // "text-rotation": "autorotate"
            },
          },
        ]}
        pan={{ x: xStartPoint, y: yStartPoint }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        motionBlur="true"
        wheelSensitivity="0.05"
      />
    </div>
    // end Tannaz
  );
}
