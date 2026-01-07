import pandas as pd
from camel_tools.disambig.bert import BERTUnfactoredDisambiguator
from camel_tools.tokenizers.word import simple_word_tokenize
from camel_tools.utils.charmap import CharMapper
from camel_tools.utils.transliterate import Transliterator


class YemenPlaceTransliterator:
    def __init__(self):
        print("Loading BERT model...")
        # Load with cache disabled
        self.disambiguator = BERTUnfactoredDisambiguator.pretrained(
            'msa',
            cache_size=0  # Disable caching to avoid LFUCache bug
        )

        # Use Buckwalter transliteration
        self.ar2bw = CharMapper.builtin_mapper('ar2bw')
        self.transliterator = Transliterator(self.ar2bw)

        # Buckwalter to readable English mapping
        self.bw_to_readable = {
            'A': 'a', 'b': 'b', 't': 't', 'v': 'th', 'j': 'j',
            'H': 'h', 'x': 'kh', 'd': 'd', '*': 'dh', 'r': 'r',
            'z': 'z', 's': 's', '$': 'sh', 'S': 's', 'D': 'd',
            'T': 't', 'Z': 'z', 'E': 'a', 'g': 'gh', 'f': 'f',
            'q': 'q', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
            'h': 'h', 'w': 'w', 'y': 'y', 'Y': 'a', 'p': 'h',
            'a': 'a', 'u': 'u', 'i': 'i', 'o': '', '~': '',
            'F': 'an', 'N': 'un', 'K': 'in', '{': 'a', '>': 'a',
            '<': 'i', '|': 'aa', '&': '', "'": '', '`': ''
        }

        print("Model loaded successfully!")

    def diacritize_text(self, arabic_text):
        """Add diacritics to undiacritized Arabic text"""
        try:
            tokens = simple_word_tokenize(arabic_text)
            disambig = self.disambiguator.disambiguate(tokens)

            diacritized_words = [d.analyses[0].analysis['diac']
                                 for d in disambig]
            return ' '.join(diacritized_words)
        except Exception as e:
            print(f"Diacritization error for '{arabic_text}': {e}")
            return arabic_text  # Return original if error

    def buckwalter_to_readable(self, bw_text):
        """Convert Buckwalter transliteration to readable English"""
        result = []
        for char in bw_text:
            if char in self.bw_to_readable:
                result.append(self.bw_to_readable[char])
            elif char == ' ':
                result.append(' ')
            else:
                result.append(char)

        # Clean up and capitalize
        readable = ''.join(result).strip()
        readable = readable.replace('  ', ' ')

        if readable:
            readable = readable[0].upper() + readable[1:]

        return readable

    def transliterate_text(self, diacritized_arabic):
        """Transliterate diacritized Arabic to English"""
        try:
            # First convert to Buckwalter
            buckwalter = self.transliterator.transliterate(diacritized_arabic)
            # Then convert to readable English
            return self.buckwalter_to_readable(buckwalter)
        except Exception as e:
            print(f"Transliteration error: {e}")
            return ""

    def process_place_name(self, arabic_name):
        """Complete pipeline: diacritize then transliterate"""
        try:
            # Step 1: Add diacritics
            diacritized = self.diacritize_text(arabic_name)

            # Step 2: Transliterate to English
            english = self.transliterate_text(diacritized)

            return {
                'original': arabic_name,
                'diacritized': diacritized,
                'transliterated': english
            }
        except Exception as e:
            print(f"Error processing '{arabic_name}': {e}")
            # Try simple transliteration without diacritization
            try:
                english = self.transliterate_text(arabic_name)
            except:
                english = ''

            return {
                'original': arabic_name,
                'diacritized': arabic_name,
                'transliterated': english
            }


def process_csv(input_file, output_file, arabic_column='place_name'):
    """Process CSV file containing Yemen administrative areas"""
    print(f"Reading {input_file}...")
    df = pd.read_csv(input_file, encoding='utf-8')
    print(f"Found {len(df)} place names")

    transliterator = YemenPlaceTransliterator()

    results = []
    for idx, row in df.iterrows():
        arabic_name = row[arabic_column]
        result = transliterator.process_place_name(arabic_name)
        results.append(result)

        if (idx + 1) % 10 == 0:
            print(f"Processed {idx + 1}/{len(df)} place names...")

    df['diacritized_arabic'] = [r['diacritized'] for r in results]
    df['english_transliteration'] = [r['transliterated'] for r in results]

    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    print(f"\n✓ Processing complete! Saved to {output_file}")

    # Show sample results
    print("\nSample results:")
    for i in range(min(5, len(df))):
        orig = df.iloc[i][arabic_column]
        trans = df.iloc[i]['english_transliteration']
        diac = df.iloc[i]['diacritized_arabic']
        print(f"  {orig} → {diac} → {trans}")


if __name__ == "__main__":
    process_csv(
        input_file=r'data\yemen_admin_areas.csv',
        output_file=r'data\yemen_admin_areas_transliterated.csv',
        arabic_column='place_name'
    )
