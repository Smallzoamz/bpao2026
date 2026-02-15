import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, sourceLang = 'TH', targetLang = 'EN' } = await request.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const apiKey = process.env.DEEPL_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
        }

        // DeepL API endpoint (free version uses .api.deepl.com, pro uses .api.deepl.com)
        const endpoint = apiKey.endsWith(':fx')
            ? 'https://api-free.deepl.com/v2/translate'
            : 'https://api.deepl.com/v2/translate';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                source_lang: sourceLang,
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('DeepL API error:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Translation failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const translatedText = data.translations?.[0]?.text || '';

        return NextResponse.json({
            translatedText,
            sourceLang: data.translations?.[0]?.detected_source_language || sourceLang
        });

    } catch (error) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
