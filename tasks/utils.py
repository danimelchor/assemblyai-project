def remove_extension(filename):
    # Split by the last period
    parts = filename.split(".")

    # Remove the last part
    parts.pop()

    # Join the parts with periods
    return ".".join(parts)

def change_extension(filename, new_ext):
    # Remove the old extension
    filename = remove_extension(filename)

    # Add the new extension
    return filename + "." + new_ext


def process_segments(segments):
    new_segments = []
    for s in segments:
        txt = s["text"].strip()
        if txt[0].isupper():
            new_segments.append(s)
        elif segments:
            new_segments[-1]["text"] += " " + txt
            new_segments[-1]["end"] = s["end"]
    return new_segments