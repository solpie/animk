var TimelineId = "timeline";
var TimelineId$ = "#" + TimelineId;
var CompositionId$ = "#composition";
var VSplitterId$ = "#VSplitter0";
var ViewportId$ = "#Viewport0";
var VScrollBarId$ = "#VScrollBar0";
var TrackHeightId$ = "#trackHeight";
var HScrollBarId$ = "#HScrollBar0";
var TrackToolId$ = "#TrackTool0";
var TitleBarId$ = "#titleBar";
var ElmData = {
    Start: "dtStart",
};
var ElmId$ = {
    cursor: "#Cursor0",
    trackWidth: "#trackWidth",
    bottomBar: "#BottomBar0",
    cursorMask: "#cursorMask",
    btnNewTrack: "#btnNewTrack",
    btnDelTrack: "#btnDelTrack",
    btnUpdate: "#btnUpdate",
    timestampBar: "#TimestampBar0",
    compCanvas: "#Canvas0",
    hSplitter: "#HSplitter0",
    comp: "#Comp0",
    toolShelf: "#ToolShelf0",
    newTrackDialog: "#fileDialog",
    saveAsDialog: "#saveAsDialog",
    openFileDialog: "#openProjDialog",

    menuBtnFile: "#MenuBtnFile",
    titleBar$: "#titleBar",
    titleMenu: "#TitleMenu0",

    //file menu
    fileMenu: "#FileMenu0",
    fileMenuNew: "#FileMenuNew",
    fileMenuOpen: "#FileMenuOpen",
    fileMenuSave: "#FileMenuSave",
    fileMenuSaveAs: "#FileMenuSaveAs",
    fileMenuOption: "#FileMenuOption",
    //popup layer
    popupLayer: "#PopupLayer0",
    //dialog
    dialogOK: "#DialogOK1",
    dialogOKBtnOK: "#DialogBtnOK0",
    dialogOKBtnCancel: "#DialogBtnCancel0",
    dialogOKContent: "#DialogOKContent0",
    //
    btnCloseSetting: "#BtnCloseSetting0",
    canvasRender: "#CanvasRender0",
    //setting win
    settingWin: "#SettingWin0",
    tabButton0: "#TabButton0",
    tabPage0: "#TabPage0",
    tabButton1: "#TabButton1",
    tabPage1: "#TabPage1",
    tabButton2: "#TabButton2",
    tabPage2: "#TabPage2",
    settingTmpPathText: "#SettingTmpPath0",
    settingTmpPathBtn: "#SettingTmpPathBtn0",
    settingDrawApp1Text: "#SettingDrawApp1",
    settingDrawApp1Btn: "#SettingDrawApp1Btn0",
    //console
    consoleWin: "#ConsoleWin0",
    consoleItemHint: "#ConsoleHint0",
    // track menu
    trackMenu: "#TrackMenu0",
    trackMenuNoEdit: "#MenuItemNoEdit",
    trackMenuNormal: "#MenuItemNormal",
    trackMenuReference: "#MenuItemReference",
    trackMenuMoveUp: "#MenuItemMoveUp",
    trackMenuMoveDown: "#MenuItemMoveDown",
    // on hold win
    onHoldWin: "#OnHoldWin0",
    onHoldWinCloseBtn: "#BtnCloseOnHoldWin0",
};
var ElmClass$ = {
    Track: ".Track",
    TrackCls: "Track",
    TrackArea: ".TrackArea",
    ActHint: ".ActHint",
    Panel: ".Panel",
    Clip: ".Clip",
    CheckBox: ".CheckBox",
    Slider: ".Slider",
    FocusHint: ".FocusHint",
    Frame: "Frame",
    VisibleCheckBox: ".VisibleCheckBox",
    Text: ".Text",
    Input: "input",
    FrameCanvas$: "FrameCanvas",
    Bar: ".Bar",
    ConsoleInput: ".ConsoleInput",
    // track menu
    MenuTitle: ".MenuTitle",
};
//back is top
var ZIdx = [ElmId$.cursor,
    ElmId$.cursorMask,
    VScrollBarId$,
    ElmId$.fileMenu,
    ElmId$.titleMenu,
    ElmId$.popupLayer
];
