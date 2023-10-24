import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const random = d3.randomNormal(0, 1);

const Nodes3 = () => {
  const counter = useRef(null);

  const [dataset, setDataset] = useState(
    Array.from({ length: 20000 }, () => [random(), random()])
  );

  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current).style("cursor", "crosshair");
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.attr("width", width).attr("height", height);
    //svg.attr("viewBox", [0, 0, width, height]);

    svg
      .append("defs")
      .append("style")
      .text(`circle.highlighted { stroke: orangered; fill: orangered; }`);

    svg.selectAll("g").remove();
    const g = svg.append("g");

    const x = d3.scaleLinear([0, 1], [0, 1000]);
    const y = d3.scaleLinear([0, 1], [0, 1000]);

    const delaunay = d3.Delaunay.from(
      dataset,
      (d) => x(d[0]),
      (d) => y(d[1])
    );

    const points = g
      .selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("fill", "#bfc9ca")
      .attr("r", 3);

    let transform = d3.zoomIdentity;

    const zoom = d3.zoom().on("zoom", zoomed);

    function zoomed(event: any) {
      console.log(event.transform.k);
      g.attr("transform", (transform = event.transform));
      //points.attr("transform", event.transform);
    }

    svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity)
      .on("pointermove", (event) => {
        const p = transform.invert(d3.pointer(event));
        const i = delaunay.find(...p);
        //console.log(dataset[i]);
        points.classed("highlighted", (_, j) => i === j);
        d3.select(points.nodes()[i]).raise();
      })
      .node();
  }, [dataset]);

  return <svg viewBox="0 0 100 50" ref={ref} />;
};

export default Nodes3;
