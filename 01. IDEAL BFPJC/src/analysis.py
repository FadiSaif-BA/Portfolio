import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import arabic_reshaper
from bidi.algorithm import get_display
import warnings
warnings.filterwarnings('ignore')

# Set Arabic-friendly font
plt.rcParams['font.family'] = 'Arial'
plt.rcParams['axes.unicode_minus'] = False

def arabic_text(text):
    """Reshape Arabic text for proper display in matplotlib"""
    if pd.isna(text):
        return ''
    text = str(text)
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

def analyze_question(df, question, question_type='SR'):
    """
    Perform EDA for a specific question in the melted dataframe
    """
    # Filter data for this question
    question_data = df[df['question'] == question].copy()
    
    print("=" * 80)
    print(f"QUESTION: {question}")
    print("=" * 80)
    
    # Basic statistics
    print(f"\n📊 Basic Statistics:")
    print(f"  Total responses: {len(question_data)}")
    print(f"  Non-null responses: {question_data['response'].notna().sum()}")
    print(f"  Missing responses: {question_data['response'].isna().sum()}")
    print(f"  Response rate: {question_data['response'].notna().sum() / len(question_data) * 100:.1f}%")
    
    # Unique values
    unique_values = question_data['response'].nunique()
    print(f"\n  Unique values: {unique_values}")
    
    # Value distribution
    print(f"\n📈 Response Distribution:")
    value_counts = question_data['response'].value_counts(dropna=False)
    print(value_counts.head(10))
    
    if len(value_counts) > 10:
        print(f"  ... and {len(value_counts) - 10} more values")
    
    # Visualization with Arabic support
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Bar chart of top responses - reshape Arabic labels
    top_n = min(10, len(value_counts))
    top_values = value_counts.head(top_n)
    
    # Reshape Arabic labels for y-axis
    arabic_labels = [arabic_text(str(label)) for label in top_values.index]
    
    y_pos = range(len(top_values))
    axes[0].barh(y_pos, top_values.values, color='steelblue')
    axes[0].set_yticks(y_pos)
    axes[0].set_yticklabels(arabic_labels)
    axes[0].set_title(f'Top {top_n} Responses', fontsize=12)
    axes[0].set_xlabel('Count')
    
    # Pie chart for response rate
    response_stats = pd.Series({
        'Valid': question_data['response'].notna().sum(),
        'Missing': question_data['response'].isna().sum()
    })
    axes[1].pie(response_stats, labels=response_stats.index, autopct='%1.1f%%', 
                colors=['lightblue', 'lightcoral'], startangle=90)
    axes[1].set_title('Response Completeness')
    
    plt.tight_layout()
    plt.show()
    
    # Geographic distribution (if district is available)
    if 'district' in question_data.columns:
        print(f"\n🗺️ Distribution by District:")
        district_dist = question_data.groupby('district')['response'].value_counts().unstack(fill_value=0)
        print(district_dist)
    
    print("\n" + "=" * 80 + "\n")
    
    return question_data