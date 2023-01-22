from sys import exit as die

try:
    import sys
except ImportError as err:
    die(err)


class ColorDetector:

    def notation_to_rgb(self, name):
        """
        Get the main RGB color for a name.

        :param name: the color name that is requested
        :returns: tuple
        """
        color = {
            'F': (3, 3, 228),
            'B': (0, 140, 255),
            'L': (255, 77, 0),
            'R': (38, 128, 0),
            'D': (255, 255, 255),
            'U': (0, 237, 255),

            # EXTRA COLORS
            'P': (255, 0, 255),
            'V': (135, 7, 117)
        }
        return color[name]

    def get_color_notation(self, hsv):
        """ Get the name of the color based on the hue.

        :returns: string
        """

        (h, s, v) = hsv

        if h <= 20 and s > 180:
            return 'B'
        elif h <= 35 and s > 140:
            return 'U'
        elif h <= 90 and s > 120:
            return 'R'
        elif h <= 125 and (h+s+v > 300):
            return 'L'
        elif h+s > 300:
            return 'F'
        return 'D'

    def average_hsv(self, roi):
        """ Average the HSV colors in a region of interest.

        :param roi: the image array
        :returns: tuple
        """
        h = 0
        s = 0
        v = 0
        num = 0
        for y in range(len(roi)):
            if y % 10 == 0:
                for x in range(len(roi[y])):
                    if x % 10 == 0:
                        chunk = roi[y][x]
                        num += 1
                        h += chunk[0]
                        s += chunk[1]
                        v += chunk[2]

        if num:
            h /= num
            s /= num
            v /= num
        return int(h), int(s), int(v)


ColorDetector = ColorDetector()
