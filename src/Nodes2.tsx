import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const generateDataset = () =>
  Array(10)
    .fill(0)
    .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);

const Nodes2 = () => {
  const [dataset, setDataset] = useState(generateDataset());
  const ref = useRef(null);
  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 1);
  }, [dataset]);

  return <svg viewBox="0 0 100 50" ref={ref} />;
};

export default Nodes2;
