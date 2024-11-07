import mitt from "mitt";
const emitter = mitt<Events>();
export type Events = {
  "on-query-footnote": string; // ref -> foot
  "on-return-footnote": string; // foot -> ref
};
export default emitter;
