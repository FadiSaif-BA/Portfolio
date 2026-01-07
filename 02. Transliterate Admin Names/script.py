import pandas as pd
from pyarabic import araby
import requests


class YemenPlaceTransliterator_2:
    def __init__(self):
        # Using a simpler approach with pyarabic
        self.vowel_map = {
            'َ': 'a',  # Fatha
            'ُ': 'u',  # Damma
            'ِ': 'i',  # Kasra
            'ً': 'an',  # Tanween Fath
            'ٌ': 'un',  # Tanween Damm
            'ٍ': 'in',  # Tanween Kasr
            'ْ': '',  # Sukun
            'ّ': '',  # Shadda (doubling)
        }

        self.letter_map = {
            'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
            'ب': 'b', 'ت': 't', 'ث': 'th',
            'ج': 'j', 'ح': '\'h', 'خ': 'kh',
            'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
            'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
            'ط': 't', 'ظ': 'z', 'ع': '\'a', 'غ': 'gh',
            'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
            'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
            'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': '',
        }

    def transliterate_with_diacritics(self, arabic_text):
        """Transliterate Arabic text that already has diacritics"""
        result = []
        for char in arabic_text:
            if char in self.vowel_map:
                result.append(self.vowel_map[char])
            elif char in self.letter_map:
                result.append(self.letter_map[char])
            elif char == ' ':
                result.append(' ')
        return ''.join(result)

    def process_csv(self, input_file, output_file, arabic_column='place_name'):
        """Process CSV - requires manually diacritized input"""
        df = pd.read_csv(input_file, encoding='utf-8')

        df['english_transliteration'] = df[arabic_column].apply(
            self.transliterate_with_diacritics
        )

        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"Processing complete! Saved to {output_file}")


# Usage
transliterator = YemenPlaceTransliterator_2()
text_transliterated = transliterator.transliterate_with_diacritics(arabic_text='بَيت عِياض')
print(text_transliterated)


