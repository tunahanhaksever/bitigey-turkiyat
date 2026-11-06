"""Bitigey Türkiyat için yerel metin dizinleme ve frekans analiz motoru.

Motor; metni değiştirmeden Türkçe/transkripsiyon karakterlerini korur,
kelimeleri satır numaralarıyla birlikte indeksler ve pandas DataFrame üretir.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import re
from typing import Any

import pandas as pd


# Türkçe I/İ dönüşümü Python'un genel lower() davranışından önce uygulanır.
TURKISH_CASE_MAP = str.maketrans({"I": "ı", "İ": "i"})

# Transkripsiyon işaretleri korunur; Unicode harf sınıfı da diğer harfleri korur.
TOKEN_PATTERN = re.compile(
    r"[^\W\d_]+(?:[-'][^\W\d_]+)*",
    flags=re.UNICODE,
)


def turkish_lower(text: str) -> str:
    """Metni Türkçe büyük/küçük harf kurallarına göre küçük harfe çevirir."""

    return text.translate(TURKISH_CASE_MAP).lower()


def clean_text(text: str) -> str:
    """Metni analiz için normalize eder ve noktalama işaretlerini temizler.

    Harfler, transkripsiyon karakterleri, kelime içi kısa çizgi ve kesme
    işareti korunur. Satır sonları analizde satır numarasını korumak için
    değiştirilmez.
    """

    if not isinstance(text, str):
        raise TypeError("text bir string olmalıdır.")

    normalized = turkish_lower(text)
    cleaned_lines: list[str] = []
    for line in normalized.splitlines():
        words = TOKEN_PATTERN.findall(line)
        cleaned_lines.append(" ".join(words))
    return "\n".join(cleaned_lines)


def index_text(text: str, min_length: int = 1) -> dict[str, dict[str, Any]]:
    """Metni kelime sıklığı ve satır numaralarıyla indeksler."""

    if min_length < 1:
        raise ValueError("min_length en az 1 olmalıdır.")

    cleaned = clean_text(text)
    frequencies: Counter[str] = Counter()
    line_numbers: defaultdict[str, set[int]] = defaultdict(set)

    for line_number, line in enumerate(cleaned.splitlines(), start=1):
        for word in line.split():
            if len(word) >= min_length:
                frequencies[word] += 1
                line_numbers[word].add(line_number)

    return {
        word: {
            "frekans": frequency,
            "satirlar": sorted(line_numbers[word]),
        }
        for word, frequency in frequencies.items()
    }


def index_to_dataframe(index: dict[str, dict[str, Any]]) -> pd.DataFrame:
    """Dizin sözlüğünü frekansa göre sıralanmış DataFrame'e çevirir."""

    rows = [
        {
            "kelime": word,
            "frekans": data["frekans"],
            "satirlar": data["satirlar"],
            "satir_sayisi": len(data["satirlar"]),
        }
        for word, data in index.items()
    ]
    return (
        pd.DataFrame(rows, columns=["kelime", "frekans", "satirlar", "satir_sayisi"])
        .sort_values(["frekans", "kelime"], ascending=[False, True], ignore_index=True)
    )


def export_results(
    dataframe: pd.DataFrame,
    csv_path: str | Path,
    excel_path: str | Path | None = None,
    docx_path: str | Path | None = None,
    doc_path: str | Path | None = None,
) -> None:
    """Sonuçları CSV, Excel, DOCX ve Word uyumlu DOC olarak aktarır."""

    dataframe.to_csv(csv_path, index=False, encoding="utf-8-sig")
    if excel_path is not None:
        dataframe.to_excel(excel_path, index=False, engine="openpyxl")
    if docx_path is not None:
        export_docx(dataframe, docx_path)
    if doc_path is not None:
        export_doc(dataframe, doc_path)


def export_docx(dataframe: pd.DataFrame, path: str | Path) -> None:
    """Dizin tablosunu gerçek bir DOCX belgesi olarak kaydeder."""

    from docx import Document

    document = Document()
    document.add_heading("Bitigey Türkiyat — Dizin ve Konkordans", level=1)
    table = document.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    for cell, heading in zip(
        table.rows[0].cells,
        ("Kelime", "Frekans", "Satırlar", "Satır sayısı"),
    ):
        cell.text = heading
    for row in dataframe.itertuples(index=False):
        cells = table.add_row().cells
        cells[0].text = str(row.kelime)
        cells[1].text = str(row.frekans)
        cells[2].text = ", ".join(map(str, row.satirlar))
        cells[3].text = str(row.satir_sayisi)
    document.save(path)


def _rtf_escape(value: object) -> str:
    """RTF içinde Türkçe ve transkripsiyon karakterlerini güvenle kodlar."""

    escaped = str(value).replace("\\", r"\\").replace("{", r"\{").replace("}", r"\}")
    return "".join(
        char if ord(char) < 128 else rf"\u{ord(char)}?"
        for char in escaped
    )


def export_doc(dataframe: pd.DataFrame, path: str | Path) -> None:
    """Word tarafından açılabilen RTF içeriğini .doc uzantısıyla kaydeder."""

    lines = [
        r"{\rtf1\ansi\deff0",
        r"{\fonttbl{\f0 Calibri;}}",
        rf"\f0\fs28 {_rtf_escape('Bitigey Türkiyat - Dizin ve Konkordans')}\par",
        r"\fs20\par",
        rf"\b {_rtf_escape('Kelime')}\tab {_rtf_escape('Frekans')}\tab "
        rf"{_rtf_escape('Satırlar')}\tab {_rtf_escape('Satır sayısı')}\b0\par",
    ]
    for row in dataframe.itertuples(index=False):
        lines.append(
            rf"{_rtf_escape(row.kelime)}\tab {row.frekans}\tab "
            rf"{_rtf_escape(', '.join(map(str, row.satirlar)))}\tab "
            rf"{row.satir_sayisi}\par"
        )
    lines.append("}")
    Path(path).write_text("\n".join(lines), encoding="ascii")


def analyze_text(
    text: str,
    csv_path: str | Path = "bitigey_dizin.csv",
    excel_path: str | Path | None = None,
    docx_path: str | Path | None = None,
    doc_path: str | Path | None = None,
    min_length: int = 1,
) -> pd.DataFrame:
    """Metni analiz eder, tabloyu terminale yazdırır ve dışa aktarır."""

    dataframe = index_to_dataframe(index_text(text, min_length=min_length))
    print(dataframe.to_string(index=False))
    export_results(
        dataframe,
        csv_path=csv_path,
        excel_path=excel_path,
        docx_path=docx_path,
        doc_path=doc_path,
    )
    return dataframe


if __name__ == "__main__":
    example_text = """Âşık kitāb okur, kitāb üzerine not düşer.
İlim ehli kitābı dikkatle inceler; ḳalem ile ḫāṭıra yazar.
Bu eski kitāb, Türk dili ve edebiyatı için kıymetlidir."""

    analyze_text(
        example_text,
        csv_path="bitigey_ornek_dizin.csv",
        excel_path=None,
        min_length=2,
    )
