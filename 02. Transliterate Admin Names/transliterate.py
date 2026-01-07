import pandas as pd
from camel_tools.morphology.database import MorphologyDB
from camel_tools.morphology.analyzer import Analyzer
from camel_tools.utils.charmap import CharMapper
from camel_tools.utils.transliterate import Transliterator


class YemenPlaceTransliterator:

    """
    Transliterator for Yemeni administrative location names from Arabic to English.

    This class provides accurate transliteration of Yemen's administrative areas
    (governorates, districts, sub-districts, villages) from Arabic script to English.
    Developed for WFP's Area Office in Aden and the Targeting and Digital Solutions unit.

    The transliteration algorithm uses:
    - CAMeL Tools morphological analyzer with calima-msa-r13 database
    - Buckwalter transliteration scheme with custom readable mapping
    - Automatic diacritization for proper vowel prediction
    - Custom dictionary for known place names with conventional spellings

    Attributes:
        db: MorphologyDB instance for Arabic morphological analysis
        analyzer: Analyzer instance for diacritization
        transliterator: Transliterator instance for Buckwalter conversion
        known_names: Dictionary of known place names with standard spellings
        bw_to_readable: Mapping from Buckwalter to readable English characters

    Example:
        >>> transliterator = YemenPlaceTransliterator()
        >>> result = transliterator.process_place_name('صنعاء')
        >>> print(result['transliterated'])
        'Sanaa'

        >>> transliterator.process_csv(
        ...     input_file='yemen_places.csv',
        ...     output_file='yemen_places_transliterated.csv',
        ...     arabic_column='place_name'
        ... )

    Notes:
        - Requires CAMeL Tools with morphology-db-msa-r13 installed
        - ع (ayn) at word beginning has no apostrophe
        - ع (ayn) in middle/end uses apostrophe (')
        - ظ and ذ both transliterate to 'dh'
        - Definite article 'ال' becomes 'Al-'
        - Long vowels (ا, و, ي) properly handled

    Version: 1.0
    Author: Fadi A. Saif, Business Analyst and Data Scientist
    WFP Yemen - Targeting and Digital Solutions Unit
    Date: January 2026
    """

    def __init__(self):
        print("Loading morphology database...")
        self.db = MorphologyDB.builtin_db('calima-msa-r13')
        self.analyzer = Analyzer(self.db)

        self.ar2bw = CharMapper.builtin_mapper('ar2bw')
        self.transliterator = Transliterator(self.ar2bw)

        # Known place names and proper nouns dictionary
        self.known_names = {
            'العيدروس': 'Al-Aidaroos',
            'عيدروس': 'Aidaroos',
            'الصبيحة': 'Al-Sabayha',
            'صبيحة': 'Sabayha',
            # We can add more known names as needed
        }

        # Improved Buckwalter to readable English mapping
        self.bw_to_readable = {
            # Consonants
            'A': 'a', 'b': 'b', 't': 't', 'v': 'th', 'j': 'j',
            'H': 'h', 'x': 'kh', 'd': 'd', '*': 'dh', 'r': 'r',
            'z': 'z', 's': 's', '$': 'sh', 'S': 's', 'D': 'd',
            'T': 't',
            'Z': 'dh',  # ظ changed to 'dh' (was 'z')
            'E': "'",  # ع (ayn) - handled separately
            'g': 'gh', 'f': 'f',
            'q': 'q', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
            'h': 'h', 'w': 'w', 'y': 'y',
            'Y': 'a',  # ى alef maksura
            'p': 'a',  # ة taa marbouta

            # Vowels - improved mapping
            'a': 'a',  # فتحة (fatha)
            'u': 'u',  # ضمة (damma)
            'i': 'i',  # كسرة (kasra)
            'o': '',  # سكون (sukun) - no vowel
            '~': '',  # شدة (shadda) - doubling

            # Tanween
            'F': 'an',  # تنوين فتح
            'N': 'un',  # تنوين ضم
            'K': 'in',  # تنوين كسر

            # Hamza variations
            '{': 'a',  # أ alef with hamza above
            '>': 'a',  # أ
            '<': 'i',  # إ alef with hamza below
            '|': 'aa',  # آ alef madda
            '&': '',  # ؤ hamza on waw
            "'": '',  # ء standalone hamza
            '`': '',  # ـ tatweel
        }

        print("Ready!")

    def diacritize_text(self, arabic_text):
        """
            Add diacritics (vowel marks) to undiacritized Arabic text using morphological analysis.

            Uses CAMeL Tools morphological analyzer to predict the most likely diacritization
            for each word based on morphological patterns and context.

            Args:
                arabic_text (str): Undiacritized Arabic text (single or multiple words)

            Returns:
                str: Arabic text with predicted diacritics (harakat)

            Example:
                >>> text = transliterator.diacritize_text('صنعاء')
                >>> print(text)
                'صَنْعَاء'

            Notes:
                - Returns original text if analysis fails
                - Uses first (most likely) analysis result for each word
                - Proper nouns may have less accurate diacritization
            """

        try:
            words = arabic_text.split()
            diacritized_words = []

            for word in words:
                analyses = self.analyzer.analyze(word)
                if analyses:
                    diacritized_words.append(analyses[0]['diac'])
                else:
                    diacritized_words.append(word)

            return ' '.join(diacritized_words)
        except Exception as e:
            print(f"Diacritization error for '{arabic_text}': {e}")
            return arabic_text

    def buckwalter_to_readable(self, bw_text):
        """
            Convert Buckwalter transliteration to human-readable English format.

            Transforms ASCII-based Buckwalter encoding into a readable romanization
            with proper handling of:
            - ع (ayn): apostrophe placement based on position
            - Long vowels: proper aa, ii, uu rendering
            - Shadda: consonant doubling
            - Definite article: Al- formatting
            - Capitalization: title case for each word

            Args:
                bw_text (str): Text in Buckwalter transliteration format

            Returns:
                str: Readable English transliteration with proper capitalization

            Example:
                >>> readable = transliterator.buckwalter_to_readable('AlSanaEap')
                >>> print(readable)
                'Al-Sanaa'

            Notes:
                - ع at word start: no apostrophe (e.g., 'Aden')
                - ع in middle/end: with apostrophe (e.g., "Sa'dah")
                - Letter after Al- treated as word start
                - ظ and ذ both become 'dh'
            """

        result = []
        i = 0
        word_start = True  # Track if we're at the start of a word

        while i < len(bw_text):
            char = bw_text[i]

            # Track word boundaries
            if char == ' ':
                word_start = True
                result.append(' ')
                i += 1
                continue

            if char == '-':
                word_start = True
                result.append('-')
                i += 1
                continue

            # Handle shadda (doubling) - Buckwalter uses ~ after the letter
            if i + 1 < len(bw_text) and bw_text[i + 1] == '~':
                # Double the current letter/sound
                if char == 'E':  # ع with shadda
                    if word_start:
                        result.append("'")
                    else:
                        result.append("'a")
                    i += 2
                    word_start = False
                    continue
                elif char in self.bw_to_readable:
                    # Double the consonant
                    sound = self.bw_to_readable[char]
                    result.append(sound + sound)
                    i += 2
                    word_start = False
                    continue

            # Special handling for ع (ayn) with vowels
            if char == 'E':  # ع (ayn)
                if i + 1 < len(bw_text):
                    next_char = bw_text[i + 1]

                    if word_start:
                        # ع at beginning of word - no apostrophe
                        if next_char == '\'a':
                            result.append("a")
                            i += 2
                            word_start = False
                            continue
                        elif next_char == '\'u':
                            result.append("u")
                            i += 2
                            word_start = False
                            continue
                        elif next_char == '\'i':
                            result.append("e")
                            i += 2
                            word_start = False
                            continue
                        else:
                            result.append("")
                            i += 1
                            word_start = False
                            continue
                    else:
                        # ع in middle or end - use apostrophe
                        if next_char == 'a':
                            result.append("'a")
                            i += 2
                            word_start = False
                            continue
                        elif next_char == 'u':
                            result.append("'u")
                            i += 2
                            word_start = False
                            continue
                        elif next_char == 'i':
                            result.append("'e")
                            i += 2
                            word_start = False
                            continue
                        elif next_char == 'o':  # sukun (no vowel)
                            result.append("'")
                            i += 2
                            word_start = False
                            continue
                        else:
                            result.append("'")
                            i += 1
                            word_start = False
                            continue
                else:
                    # ع at end of word
                    if word_start:
                        result.append("")
                    else:
                        result.append("'")
                    i += 1
                    word_start = False
                    continue

            # Handle long vowels - skip short vowel before long vowel letter
            elif char == 'a':  # fatha
                if i + 1 < len(bw_text):
                    next_char = bw_text[i + 1]
                    if next_char == 'A' or next_char == 'Y':  # followed by ا or ى
                        i += 1
                        word_start = False
                        continue
                result.append('a')
                word_start = False

            elif char == 'u':  # damma
                if i + 1 < len(bw_text):
                    next_char = bw_text[i + 1]
                    if next_char == 'w':  # followed by و
                        i += 1
                        word_start = False
                        continue
                result.append('u')
                word_start = False

            elif char == 'i':  # kasra
                if i + 1 < len(bw_text):
                    next_char = bw_text[i + 1]
                    if next_char == 'y':  # followed by ي
                        i += 1
                        word_start = False
                        continue
                result.append('i')
                word_start = False

            # Handle long vowel letters
            elif char == 'A':  # ا (alef)
                result.append('a')
                word_start = False

            elif char == 'w':  # و
                if i > 0 and bw_text[i - 1] == 'u':
                    result.append('u')
                else:
                    result.append('w')
                word_start = False

            elif char == 'y':  # ي
                if i > 0 and bw_text[i - 1] == 'i':
                    result.append('i')
                else:
                    result.append('y')
                word_start = False

            elif char == 'Y':  # ى (alef maksura)
                result.append('a')
                word_start = False

            elif char == '~':  # Shadda standalone (skip, already handled)
                i += 1
                continue

            elif char in self.bw_to_readable:
                result.append(self.bw_to_readable[char])
                word_start = False
            else:
                result.append(char)
                word_start = False

            i += 1

        # Clean up
        readable = ''.join(result).strip()
        readable = readable.replace('  ', ' ')

        # Split into words and capitalize each
        words = readable.split()
        capitalized_words = []

        for idx, word in enumerate(words):
            word_lower = word.lower()

            # Handle definite article Al-
            if word_lower == 'al':
                capitalized_words.append('Al-')
            elif word_lower.startswith('al') and len(word) > 2:
                # Al is attached to the word - separate it
                # Treat letter after 'al' as word_start (capitalize it)
                rest_of_word = word[2:]
                if rest_of_word:
                    capitalized_words.append('Al-' + rest_of_word[0].upper() + rest_of_word[1:])
                else:
                    capitalized_words.append('Al-')
            else:
                # Regular word - capitalize first letter
                if word:
                    capitalized_words.append(word[0].upper() + word[1:])

        # Join and fix spacing around hyphens
        result_text = ' '.join(capitalized_words)
        result_text = result_text.replace(' -', '-').replace('- ', '-')

        return result_text

    def transliterate_text(self, diacritized_arabic):
        """
    Transliterate diacritized Arabic text to English.

    Two-step process:
    1. Convert Arabic to Buckwalter transliteration
    2. Convert Buckwalter to readable English format

    Args:
        diacritized_arabic (str): Arabic text with diacritics

    Returns:
        str: English transliteration in readable format

    Example:
        >>> result = transliterator.transliterate_text('صَنْعَاء')
        >>> print(result)
        'Sanaa'

    Notes:
        - Returns empty string if transliteration fails
        - Diacritics must be present for accurate vowel rendering
    """

        try:
            buckwalter = self.transliterator.transliterate(diacritized_arabic)
            return self.buckwalter_to_readable(buckwalter)
        except Exception as e:
            print(f"Transliteration error: {e}")
            return ""

    def process_place_name(self, arabic_name):
        """
    Complete pipeline: diacritize and transliterate Arabic place name to English.

    Process flow:
    1. Split name into individual words
    2. Check each word against known_names dictionary
    3. For unknown words: diacritize → transliterate
    4. Combine results with proper spacing

    Args:
        arabic_name (str): Arabic place name (can contain multiple words)

    Returns:
        dict: Dictionary with three keys:
            - 'original' (str): Original Arabic input
            - 'diacritized' (str): Arabic with predicted diacritics
            - 'transliterated' (str): English transliteration

    Example:
        >>> result = transliterator.process_place_name('وادي حضرموت')
        >>> print(result['transliterated'])
        'Wadi Hadramawt'

        >>> result = transliterator.process_place_name('العيدروس')
        >>> print(result['transliterated'])
        'Al-Aidaroos'  # From known_names dictionary

    Notes:
        - Known names take precedence over algorithmic transliteration
        - Each word processed independently for better accuracy
        - Handles multi-word place names correctly
    """

        try:
            import re

            # Split the name into words
            arabic_words = arabic_name.strip().split()

            # Process each word, checking against known names
            transliterated_words = []
            diacritized_words = []

            for word in arabic_words:
                # Remove diacritics for matching
                clean_word = re.sub(r'[\u064B-\u065F]', '', word)

                # Check if this word is in known names dictionary
                if clean_word in self.known_names:
                    transliterated_words.append(self.known_names[clean_word])
                    diacritized_words.append(word)  # Keep original with diacritics
                else:
                    # Use normal diacritization and transliteration
                    try:
                        diacritized = self.diacritize_text(word)
                        transliterated = self.transliterate_text(diacritized)

                        diacritized_words.append(diacritized)
                        transliterated_words.append(transliterated)
                    except Exception as e:
                        print(f"Error processing word '{word}': {e}")
                        diacritized_words.append(word)
                        transliterated_words.append('')

            # Join the results
            final_diacritized = ' '.join(diacritized_words)
            final_transliterated = ' '.join(transliterated_words)

            return {
                'original': arabic_name,
                'diacritized': final_diacritized,
                'transliterated': final_transliterated
            }
        except Exception as e:
            print(f"Error processing '{arabic_name}': {e}")
            try:
                diacritized = self.diacritize_text(arabic_name)
                english = self.transliterate_text(diacritized)
            except:
                diacritized = arabic_name
                english = ''

            return {
                'original': arabic_name,
                'diacritized': diacritized,
                'transliterated': english
            }


    def process_csv(self, input_file, output_file, arabic_column='place_name'):
        """
            Batch process CSV file containing Arabic place names.

            Reads a CSV file, transliterates all Arabic place names, and saves results
            to a new CSV with additional columns for diacritized and transliterated names.

            Args:
                input_file (str): Path to input CSV file with Arabic place names
                output_file (str): Path to output CSV file for results
                arabic_column (str, optional): Name of column containing Arabic names.
                    Defaults to 'place_name'.

            Returns:
                None: Results saved to output_file

            Output CSV columns:
                - All original columns preserved
                - 'diacritized_arabic': Arabic text with diacritics added
                - 'english_transliteration': English transliteration

            Example:
                >>> transliterator = YemenPlaceTransliterator()
                >>> transliterator.process_csv(
                ...     input_file='yemen_admin_areas.csv',
                ...     output_file='yemen_admin_areas_transliterated.csv',
                ...     arabic_column='place_name'
                ... )
                Reading yemen_admin_areas.csv...
                Found 5000 place names
                Processed 50/5000 place names...
                ...
                ✓ Processing complete! Saved to yemen_admin_areas_transliterated.csv

            Notes:
                - Progress printed every 50 rows
                - Sample results shown at completion
                - Errors tracked and reported
                - UTF-8 encoding with BOM for Excel compatibility
            """

        # import pandas as pd

        print(f"Reading {input_file}...")
        df = pd.read_csv(input_file, encoding='utf-8')
        print(f"Found {len(df)} place names")

        results = []
        errors = 0
        for idx, row in df.iterrows():
            arabic_name = row[arabic_column]
            result = self.process_place_name(arabic_name)
            results.append(result)

            if not result['transliterated']:
                errors += 1

            if (idx + 1) % 50 == 0:
                print(f"Processed {idx + 1}/{len(df)} place names...")

        df['diacritized_arabic'] = [r['diacritized'] for r in results]
        df['english_transliteration'] = [r['transliterated'] for r in results]

        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"\n✓ Processing complete! Saved to {output_file}")
        print(f"  Successful: {len(df) - errors}/{len(df)}")
        if errors > 0:
            print(f"  Errors: {errors}")

        # Show sample results
        print("\nSample results:")
        for i in range(min(10, len(df))):
            orig = df.iloc[i][arabic_column]
            trans = df.iloc[i]['english_transliteration']
            if trans:
                print(f"  {orig} → {trans}")


