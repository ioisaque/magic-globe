import cv2
import sys
import math
import time
import json
import imutils
import kociemba
import pyperclip
import numpy as np
from serial import Serial
from ColorDetector import ColorDetector

# ------------------------------------------     GENERAL ARRAYS SETUP    ------------------------------------------ #
FACES = ['U', 'R', 'F', 'D', 'L', 'B']

STATE = {'U': ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
         'R': ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
         'F': ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
         'D': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
         'L': ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
         'B': ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B']}

ini = open("roi.ini", "r+")
ROIs = json.loads(ini.read())
ini.close()
# ----------------------------------------------------------------------------------------------------------------- #
# -----------------------------------------------    CAMERA SETUP   ----------------------------------------------- #
# UPPER_CAM = cv2.VideoCapture(0)
# DOWN_CAM = UPPER_CAM
UPPER_CAM = cv2.VideoCapture('rtsp://admin:ggq1LwVy@192.168.0.245:554/Streaming/Channels/102/')
DOWN_CAM = cv2.VideoCapture('rtsp://admin:ggq1LwVy@192.168.0.245:554/Streaming/Channels/302/')
# ----------------------------------------------------------------------------------------------------------------- #
# -------------------------------------------     GENERAL VARS SETUP    ------------------------------------------- #
SCREEN_X = 2560
SCREEN_Y = 1600
SLICE = int(SCREEN_X / 9)

CubletF = 'F'
CubletI =  4
isMovingCublet = False

FONT_COLOR = (200, 200, 200)
G_FONT = cv2.FONT_HERSHEY_DUPLEX
D_FONT = cv2.FONT_HERSHEY_SIMPLEX

isDemoEnabled = True
isDebugEnabled = False
isPauseEnabled = False

isCubeSolving = False
isCubeSolvable = False
isAutoSolveEnabled = False

ARDUINO = False
SOLVE_TIME = 0
ALGORITHM = "R L U2 R L' B2 U2 R2 F2 L2 D2 L2 F2"
SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"

try:
    ARDUINO = Serial(port='/dev/cu.usbmodem1201', baudrate=9600, timeout=0)
    ARDUINO.flushInput()
except Exception as err:
    print(err)

# ----------------------------------------------------------------------------------------------------------------- #
def serial_com(load=False):
    if load:
        ARDUINO.write(bytes(load, 'utf-8'))
    time.sleep(0.05)
    data = ARDUINO.readline().decode()
    return data


def move_cublet(event, mouse_x, mouse_y, flags, param):
    global isMovingCublet, CubletF, CubletI, CH

    if event == cv2.EVENT_LBUTTONDOWN:
        for f in FACES:
            ########## RUN CUBIES ON SCREEN ##########
            for i, (x, y) in enumerate(ROIs[f]):
                if (x - CH <= mouse_x <= x + CH) and (y - CH <= mouse_y <= y + CH):
                    CubletF = f
                    CubletI = i
                    isMovingCublet = True
    elif event == cv2.EVENT_MOUSEMOVE:
        if isMovingCublet:
            ROIs[CubletF][CubletI] = [mouse_x, mouse_y]
    elif event == cv2.EVENT_LBUTTONUP:
        isMovingCublet = False

    uini = open("roi.ini", "r+")
    uini.truncate(0)
    uini.write(json.dumps(ROIs))
    uini.close()


while True:
    ### GET FEED FRAME ###
    if not isPauseEnabled:
        _, FEED_01 = UPPER_CAM.read()
        _, FEED_02 = DOWN_CAM.read()

        FEED_01 = cv2.imread('UPPER_PREVIEW1.jpg')
        FEED_02 = cv2.imread('DOWN_PREVIEW1.jpg')

        if ARDUINO:
            ArduinoSaid = serial_com()
            if 'Solved in ' in ArduinoSaid:
                SOLVE_TIME = float(int(ArduinoSaid.replace('Solved in ', '').replace(' miliseconds', '')) / 1000.0)
                print('SOLVE_TIME => ', SOLVE_TIME)

    # -----------------------------------------------     FEED SETUP    ----------------------------------------------- #
    FEED_Y = int(SLICE * 3)
    FEED_X = int((FEED_01.shape[1] - FEED_Y) / 2)

    FEED_01 = imutils.resize(FEED_01, height=FEED_Y)
    FEED_02 = imutils.resize(FEED_02, height=FEED_Y)

    if FEED_01.shape[0] != FEED_01.shape[1]:
        FEED_01 = FEED_01[0:FEED_Y, FEED_X:FEED_Y + FEED_X]

    if FEED_02.shape[0] != FEED_02.shape[1]:
        FEED_02 = FEED_02[0:FEED_Y, FEED_X:FEED_Y + FEED_X]

    BLACK_Y = np.zeros((int((SCREEN_Y - FEED_Y) / 2), SCREEN_X, 3), np.uint8)
    BLACK_X_L = np.zeros((FEED_Y, SLICE, 3), np.uint8)
    BLACK_X_M = np.zeros((FEED_Y, int(SCREEN_X - SLICE * 8), 3), np.uint8)
    BLACK_X_R = np.zeros((FEED_Y, SLICE, 3), np.uint8)
    BLACK_Y[:] = BLACK_X_L[:] = BLACK_X_M[:] = BLACK_X_R[:] = (000, 000, 000)

    FEED = np.concatenate((FEED_01, BLACK_X_L, BLACK_X_M, BLACK_X_R, FEED_02), axis=1)
    FEED = np.concatenate((BLACK_Y, FEED, BLACK_Y), axis=0)

    HSV = cv2.cvtColor(FEED, cv2.COLOR_BGR2HSV)
    # ----------------------------------------------------------------------------------------------------------------- #
    # -----------------------------------------------   PREVIEW SETUP   ----------------------------------------------- #
    CENTER_Y = int(SCREEN_Y / 2)
    CENTER_X = int(SCREEN_X / 2)

    CUBLET_SIZE = math.floor(int(BLACK_X_M.shape[1] / 5))
    CH = math.floor(CUBLET_SIZE / 2)

    P_START_POINT_Y = CENTER_Y - (CUBLET_SIZE * 4)
    P_START_POINT_X = CENTER_X - (CUBLET_SIZE * 6)

    CUBLETS = {
        'U': [[CH * 7, CH * 1], [CH * 9, CH * 1], [CH * 11, CH * 1], [CH * 7, CH * 3], [CH * 9, CH * 3],
              [CH * 11, CH * 3], [CH * 7, CH * 5], [CH * 9, CH * 5], [CH * 11, CH * 5]],
        'R': [[CH * 13, CH * 7], [CH * 15, CH * 7], [CH * 17, CH * 7], [CH * 13, CH * 9], [CH * 15, CH * 9],
              [CH * 17, CH * 9], [CH * 13, CH * 11], [CH * 15, CH * 11], [CH * 17, CH * 11]],
        'F': [[CH * 7, CH * 7], [CH * 9, CH * 7], [CH * 11, CH * 7], [CH * 7, CH * 9], [CH * 9, CH * 9],
              [CH * 11, CH * 9], [CH * 7, CH * 11], [CH * 9, CH * 11], [CH * 11, CH * 11]],
        'D': [[CH * 7, CH * 13], [CH * 9, CH * 13], [CH * 11, CH * 13], [CH * 7, CH * 15], [CH * 9, CH * 15],
              [CH * 11, CH * 15], [CH * 7, CH * 17], [CH * 9, CH * 17], [CH * 11, CH * 17]],
        'L': [[CH * 1, CH * 7], [CH * 3, CH * 7], [CH * 5, CH * 7], [CH * 1, CH * 9], [CH * 3, CH * 9],
              [CH * 5, CH * 9], [CH * 1, CH * 11], [CH * 3, CH * 11], [CH * 5, CH * 11]],
        'B': [[CH * 19, CH * 7], [CH * 21, CH * 7], [CH * 23, CH * 7], [CH * 19, CH * 9], [CH * 21, CH * 9],
              [CH * 23, CH * 9], [CH * 19, CH * 11], [CH * 21, CH * 11], [CH * 23, CH * 11]]}
    # ----------------------------------------------------------------------------------------------------------------- #
    # ------------------------------------------------   SOLVER MAIN   ------------------------------------------------ #
    ### SET CURRENT CUBE STATE ###
    CUBE_STATE = pyperclip.paste().replace(' ', '')

    if len(CUBE_STATE) != 54:
        CUBE_STATE = ''
        for face in FACES:
            CUBE_STATE += ''.join(STATE[face])


    ### TRY GET SOLUTION ###
    try:
        ### UPDATE VARS ACCORDING TO CUBE STATE ###
        if CUBE_STATE == SOLVED_STATE:
            isCubeSolving = False
            isCubeSolvable = False
            FONT_COLOR = ColorDetector.notation_to_rgb('P')
            SOLUTION_TEXT = "Solved in " + str("{0:.3f}".format(SOLVE_TIME)) + " second(s)"
        elif isCubeSolving:
            FONT_COLOR = ColorDetector.notation_to_rgb('P')
            SOLUTION_TEXT = str("{0:.3f}".format(SOLVE_TIME)) + " second(s)"
        else:
            ALGORITHM = kociemba.solve(CUBE_STATE)
            isCubeSolvable = True
            pyperclip.copy(ALGORITHM)
            SOLUTION_TEXT = str(ALGORITHM) + ' (' + str(len(ALGORITHM.split(' '))) + ' moves)'
    except Exception as err:
        isCubeSolving = False
        isCubeSolvable = False
        SOLUTION_TEXT = str(err)
        FONT_COLOR = ColorDetector.notation_to_rgb('F')

    ### GET BOUNDARY OF STATE & SOLUTION TEXTS ###
    STATE_TEXT_SIZE = cv2.getTextSize(CUBE_STATE, G_FONT, 1.5, 2)[0]
    SOLUTION_TEXT_SIZE = cv2.getTextSize(SOLUTION_TEXT, G_FONT, 1.5, 2)[0]

    ### GET COORDS BASED ON BOUNDARY ###
    STATE_TEXT_S = int((STATE_TEXT_SIZE[0] / 54) + 3)
    STATE_TEXT_X = int((SCREEN_X - STATE_TEXT_S * 59) / 2)
    STATE_TEXT_Y = int(STATE_TEXT_SIZE[1] + int(SCREEN_Y * 0.075))

    SOLUTION_TEXT_X = int((FEED.shape[1] - SOLUTION_TEXT_SIZE[0]) / 2)
    SOLUTION_TEXT_Y = int(SOLUTION_TEXT_SIZE[1] + int(SCREEN_Y * 0.15))

    ### RUN FACES ###
    for face in FACES:
        ########## DISPLAY CUBIES ON SCREEN ##########
        for index, (x, y) in enumerate(ROIs[face]):
            faceColor = ColorDetector.notation_to_rgb(face)
            if index == 4:
                cv2.rectangle(FEED, (x - int(CH / 2), y - int(CH / 2)), (x + int(CH / 2), y + int(CH / 2)),
                              ColorDetector.notation_to_rgb(face), -1)
                cv2.putText(FEED, face, (x - int(CH / 4), y + int(CH / 4)), G_FONT, .6, (0, 0, 0), 2)
            else:
                roi = HSV[y - 6:y + 6, x - 6:x + 6]
                avg_hsv = ColorDetector.average_hsv(roi)
                notation = ColorDetector.get_color_notation(avg_hsv)

                ROIs[face][index] = [x, y]
                STATE[face][index] = notation

                cv2.rectangle(FEED, (x - int(CH / 2), y - int(CH / 2)), (x + int(CH / 2), y + int(CH / 2)),
                              ColorDetector.notation_to_rgb(notation), -1)
                cv2.putText(FEED, face + str(index + 1), (x - 4 - int(CH / 4), y + int(CH / 4)), G_FONT, .6, faceColor, 2)

            ########## DISPLAY OPEN RUBIK'S CUBE STATE PREVIEW ON SCREEN ##########
            (x, y) = CUBLETS[face][index]
            x = P_START_POINT_X + x
            y = P_START_POINT_Y + y
            if index != 4:
                cv2.rectangle(FEED, (x - CH, y - CH), (x + CH, y + CH), ColorDetector.notation_to_rgb(notation), -1)
            else:
                cv2.rectangle(FEED, (x - CH, y - CH), (x + CH, y + CH), ColorDetector.notation_to_rgb(face), -1)
            cv2.rectangle(FEED, (x - CH, y - CH), (x + CH, y + CH), (0, 0, 0), 2)

            if index != 4:
                if isDebugEnabled:
                    ## SEPARATES HSV VALUE ##
                    (H, S, V) = avg_hsv
                    ## DISPLAYS H VALUE ##
                    cv2.putText(FEED, str(H).zfill(3), (x - int(CH * .7), y - int(CH * .4)), D_FONT, .6, (0, 0, 0), 2)
                    ## DISPLAYS S VALUE ##
                    cv2.putText(FEED, str(S).zfill(3), (x - int(CH * .7), y + int(CH * .225)), D_FONT, .6, (0, 0, 0), 2)
                    ## DISPLAYS V VALUE ##
                    cv2.putText(FEED, str(V).zfill(3), (x - int(CH * .7), y + CH - 5), D_FONT, .6, (0, 0, 0), 2)
                else:
                    cv2.putText(FEED, str(index + 1), (x - 8, y + 8), G_FONT, .9, (0, 0, 0), 2)

        ########## DISPLAY STATE WITH NOTATION ON SCREEN ##########
        for index, (notation) in enumerate(STATE[face]):
            cv2.putText(FEED, notation, (STATE_TEXT_X, STATE_TEXT_Y), G_FONT, 1.5,
                        (0, 0, 0) if FONT_COLOR == (0, 0, 0) and notation == 'D' else ColorDetector.notation_to_rgb(
                            notation), 2)
            STATE_TEXT_X = STATE_TEXT_X + STATE_TEXT_S
        STATE_TEXT_X = STATE_TEXT_X + STATE_TEXT_S

    ########## DISPLAY SOLVER ALGORITHM ON SCREEN ##########
    if not isCubeSolving and isCubeSolvable:
        for move in ALGORITHM.split(' '):
            MOVE_TEXT_SIZE = cv2.getTextSize(move, G_FONT, 1.5, 2)[0][0]
            notation = move if len(move) == 1 else ''.join([i for i in move if not i.isdigit()]).replace("'", "")
            cv2.putText(FEED, str(move), (SOLUTION_TEXT_X, SOLUTION_TEXT_Y), G_FONT, 1.5,
                        (0, 0, 0) if FONT_COLOR == (0, 0, 0) and notation == 'D' else ColorDetector.notation_to_rgb(
                            notation), 2)
            SOLUTION_TEXT_X += MOVE_TEXT_SIZE + STATE_TEXT_S
    else:
        cv2.putText(FEED, str(SOLUTION_TEXT), (SOLUTION_TEXT_X, SOLUTION_TEXT_Y), G_FONT, 1.5, FONT_COLOR, 2)

    ### DISPLAY FEEDS ###
    cv2.namedWindow("MAGIC_GLOBE")
    # cv2.setWindowProperty("MAGIC_GLOBE", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
    cv2.imshow("MAGIC_GLOBE", FEED)
    cv2.setMouseCallback("MAGIC_GLOBE", move_cublet)

    # ----------------------------------------------------------------------------------------------------------------- #
    # ----------------------------------------------   SOLVER CONTROLS   ---------------------------------------------- #
    ########## SET KEYPRESS ##########
    key = cv2.waitKey(1) & 0xFF

    # if key != 255:
    # print('KEY PRESSED => ', key)

    ## GET TAB PRESS ##
    if key == 9:
        isDebugEnabled = not isDebugEnabled

    ## GET ENTER PRESS ##
    if key == 13:
        isPauseEnabled = not isPauseEnabled

    ## GET DEL or ESC PRESS ##
    if key == 127 or key == 27:
        sys.exit("Ernő said enough cheating!")

    ## GET SPACE BAR PRESS ##
    if key == 32:
        isAutoSolveEnabled = not isAutoSolveEnabled

    ## IF CUBE IS SOLVABLE, SOLVE IT! ##
    if ARDUINO and not isCubeSolving and isAutoSolveEnabled and isCubeSolvable:
        isCubeSolving = True
        isCubeSolvable = False
        serial_com(ALGORITHM.encode())
        print("SOLUTION => " + str(ALGORITHM))

# ----------------------------------------------------------------------------------------------------------------- #
