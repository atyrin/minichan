function AddMarkup(button,textAreaId)
{
    if (button && textAreaId)
    {
        var textArea = document.getElementById(textAreaId)
        var selectionStart = textArea.selectionStart;
        var selectionEnd = textArea.selectionEnd;
        textArea.value = textArea.value.substring(0,selectionStart) + "[" + button.dataset.markupTag + "]" +
                        textArea.value.substring(selectionStart,selectionEnd) + "[/" + button.dataset.markupTag + "]" +
                        textArea.value.substring(selectionEnd);
    }
}