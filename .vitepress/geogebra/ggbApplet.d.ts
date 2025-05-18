// TypeScript declaration file for GeoGebra Apps API
// Based on documentation: https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/

// Interface for GeoGebra applet instance (ggbApplet)
interface GeoGebraApplet {
  /** Inject applet into DOM element */
  inject(id: string, type?: string): void;
  /** Optional, set HTML5 codebase */
  setHTML5Codebase?(codebase: string): void;
  // Core Methods
  evalCommand(command: string): void;
  /** Returns result of CAS command, type varies */
  evalCommandCAS(command: string): any;
  /** Returns label of created object */
  evalCommandGetLabels(command: string): string;
  setValue(name: string, value: number): void;
  getValue(name: string): number;
  getValueString(name: string): string;
  setVisible(name: string, visible: boolean): void;
  getVisible(name: string): boolean;
  setColor(name: string, red: number, green: number, blue: number): void;
  /** Overload for hex color string */
  setColor(name: string, color: string): void;
  /** Returns hex color */
  getColor(name: string): string;
  setLayer(name: string, layer: number): void;
  getLayer(name: string): number;
  setLabelVisible(name: string, visible: boolean): void;
  setLabelStyle(name: string, style: number): void;
  getLabelStyle(name: string): number;
  setFixed(name: string, fixed: boolean, selectionAllowed?: boolean): void;
  setTrace(name: string, trace: boolean): void;
  setCoords(name: string, x: number, y: number, z?: number): void;
  getXcoord(name: string): number;
  getYcoord(name: string): number;
  /** e.g., "point", "line" */
  getObjectType(name: string): string;
  getObjectName(index: number): string;
  getObjectNumber(): number;
  exists(name: string): boolean;
  deleteObject(name: string): void;
  renameObject(oldName: string, newName: string): boolean;
  /** Sets toolbar mode */
  setMode(mode: number): void;
  getMode(): number;
  /** e.g., "G" for Graphing */
  setPerspective(perspective: string): void;
  reset(): void;
  undo(): void;
  redo(): void;
  setRepaintingActive(active: boolean): void;
  refreshView(): void;
  setOnTheFlyPointCreationActive(active: boolean): void;
  setPointCapture(view: number, capture: number): void;
  /** e.g., "2" or "auto" */
  setRounding(digits: number | string): void;
  /** Returns base64-encoded PNG */
  getPNGBase64(resolution?: number): string;
  /** Returns XML of applet or object */
  getXML(name?: string): string;
  setXML(xml: string): void;
  getPerspectiveXML(): string;
  setAnimating(name: string, animate: boolean): void;
  setAnimationSpeed(name: string, speed: number): void;
  startAnimation(): void;
  stopAnimation(): void;
  isAnimationRunning(): boolean;

  // Event Listeners
  registerAddListener(listener: string | ((name: string) => void)): void;
  unregisterAddListener(listener: string | ((name: string) => void)): void;
  registerRemoveListener(listener: string | ((name: string) => void)): void;
  unregisterRemoveListener(listener: string | ((name: string) => void)): void;
  registerClearListener(listener: string | (() => void)): void;
  unregisterClearListener(listener: string | (() => void)): void;
  registerRenameListener(
    listener: string | ((oldName: string, newName: string) => void)
  ): void;
  unregisterRenameListener(
    listener: string | ((oldName: string, newName: string) => void)
  ): void;
  registerUpdateListener(listener: string | ((name: string) => void)): void;
  unregisterUpdateListener(listener: string | ((name: string) => void)): void;
  registerObjectUpdateListener(
    objName: string,
    listener: string | ((name: string) => void)
  ): void;
  unregisterObjectUpdateListener(objName: string): void;
  registerClickListener(listener: string | ((name: string) => void)): void;
  unregisterClickListener(listener: string | ((name: string) => void)): void;
  /** Event type varies */
  registerClientListener(listener: string | ((event: any) => void)): void;
  unregisterClientListener(listener: string | ((event: any) => void)): void;

  // File and Material Methods
  /** Returns base64-encoded GGB file */
  getBase64(): string;
  setBase64(base64: string): void;
  saveState(): void;
  restoreState(): void;
}

// Interface for GGBApplet constructor parameters
interface GeoGebraParameters {
  /** App name, e.g., "graphing", "geometry", "classic". Default: "classic" */
  appName?: string;

  /** Applet width in pixels (required unless scaleContainerClass is used) */
  width?: number;

  /** Applet height in pixels (required unless scaleContainerClass is used) */
  height?: number;

  /** GeoGebra Materials ID to load, @example "RHYH3UQ8" */
  material_id?: string;

  /** URL of .ggb file to load, e.g., "myFile.ggb" */
  filename?: string;

  /** Base64 encoded .ggb file content */
  ggbBase64?: string;

  /** Border color as hex RGB string, e.g., "#FFFFFF". Default: gray */
  borderColor?: string;

  /** Border radius size in pixels */
  borderRadius?: number;

  /** Enable right-click handling (context menus, properties, zoom). Default: true */
  enableRightClick?: boolean;

  /** Enable dragging of labels. Default: true */
  enableLabelDrags?: boolean;

  /** Enable shift-drag to move or shift-wheel to zoom. Default: true */
  enableShiftDragZoom?: boolean;

  /** Show zoom in/out/home buttons in Graphics View. Default: false */
  showZoomButtons?: boolean;

  /** Show error dialogs for invalid inputs. Default: true */
  errorDialogsActive?: boolean;

  /** Show GeoGebra menubar. Default: false */
  showMenuBar?: boolean;

  /** Show toolbar with construction mode buttons. Default: false */
  showToolBar?: boolean;

  /** Show toolbar help text. Default: false */
  showToolBarHelp?: boolean;

  /** Custom toolbar string, e.g., "0 1 2 3 , 4 5 6 7" */
  customToolBar?: string;

  /** Show algebra input line with field and commands. Default: false */
  showAlgebraInput?: boolean;

  /** Show reset icon in upper right corner. Default: false */
  showResetIcon?: boolean;

  /** ISO language code for applet language */
  language?: string;

  /** ISO country code, e.g., "AT" for Austria */
  country?: string;

  /** ID for ggbOnInit callback, e.g., "applet2" */
  id?: string;

  /** Allow Style Bar to be shown. Default: false */
  allowStyleBar?: boolean;

  /** Randomize random numbers on file load. Default: true */
  randomize?: boolean;

  /** Seed for random numbers, e.g., 33 */
  randomSeed?: number;

  /** JavaScript function to run on applet load */
  appletOnLoad?: (api: any) => void;

  /** Use browser for JavaScript handling. Default: false */
  useBrowserForJS?: boolean;

  /** Show logging in browser console. Default: false */
  showLogging?: boolean;

  /** Sensitivity for object selection (higher = easier). Default: 3 */
  capturingThreshold?: number;

  /** Enable file saving/loading and sign-in. Default: true */
  enableFileFeatures?: boolean;

  /** Show Undo/Redo icons. Default: true */
  enableUndoRedo?: boolean;

  /** Perspective setting for blank start */
  perspective?: string;

  /** Enable 3D mode (for exam mode) */
  enable3d?: boolean | null;

  /** Enable CAS mode (for exam mode) */
  enableCAS?: boolean | null;

  /** Position of algebra input: "algebra", "top", or "bottom" */
  algebraInputPosition?: string;

  /** Prevent applet from auto-focusing. Default: false */
  preventFocus?: boolean;

  /** CSS class for container to scale applet */
  scaleContainerClass?: string;

  /** Compute height automatically based on width. Default: false */
  autoHeight?: boolean;

  /** Allow applet to scale up. Default: false */
  allowUpscale?: boolean;

  /** Show preview image and play button. Default: false */
  playButton?: boolean;

  /** Scaling ratio for applet (e.g., 2 for 2x). Default: 1 */
  scale?: number;

  /** Show animation button */
  showAnimationButton?: boolean;

  /** Show fullscreen button */
  showFullscreenButton?: boolean;

  /** Show suggestion buttons in Algebra View */
  showSuggestionButtons?: boolean;

  /** Show "Welcome" tooltip */
  showStartTooltip?: boolean;

  /** Decimal places or significant digits, e.g., "10" or "10s" */
  rounding?: string;

  /** Buttons have shadow */
  buttonShadows?: boolean;

  /** Relative radius of button’s rounded border (0 to 0.9). Default: 0.2 */
  buttonRounding?: number;

  /** Button border color as hex, e.g., "#RRGGBB" */
  buttonBorderColor?: string;

  /** Background color of evaluator app as hex */
  editorBackgroundColor?: string;

  /** Text color of equation editor as hex */
  editorForegroundColor?: string;

  /** Enable text mode for evaluator app. Default: false */
  textmode?: boolean;

  /** Show keyboard on input focus: "true", "false", or "auto" */
  showKeyboardOnFocus?: string;

  /** Keyboard type for evaluator: "scientific", "normal", "notes" */
  keyboardType?: string;

  /** Make Graphics Views transparent */
  transparentGraphics?: boolean;

  /** Disable JavaScript from material files */
  disableJavaScript?: boolean;

  /** DOM selector for keyboard attachment */
  detachedKeyboardParent?: string;
}

// Interface for GGBApplet constructor
interface GeoGebraConstructor {
  new (
    parameters: GeoGebraParameters,
    version?: string,
    views?: Record<string, any>
  ): GeoGebraApplet;
}

// Global declarations
declare var GGBApplet: GeoGebraConstructor;
declare var ggbApplet: GeoGebraApplet;

// Module declaration for module-based imports
declare module "geogebra" {
  export const GGBApplet: GeoGebraConstructor;
  export const ggbApplet: GeoGebraApplet;
}
