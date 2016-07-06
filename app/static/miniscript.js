function AddMarkup(button,textAreaId)
{
    if (button && textAreaId)
    {
        var textArea = document.getElementById(textAreaId);
        var selectionStart = textArea.selectionStart;
        var selectionEnd = textArea.selectionEnd;
        textArea.value = textArea.value.substring(0,selectionStart) + "[" + button.dataset.markupTag + "]" +
                        textArea.value.substring(selectionStart,selectionEnd) + "[/" + button.dataset.markupTag + "]" +
                        textArea.value.substring(selectionEnd);
    }
}

function ShowForm(formName)
{
    if (document.getElementById(formName).style.display == 'none')
        $(formName).show(600, "linear");
    else
        $(formName).hide("fast");
}

function ScrollTop()
{
    window.scrollTo(0,document.body.scrolltop);
}

function ScrollBottom()
{
    window.scrollTo(0,document.body.scrollHeight);
}

function AddReplyLink(reply,formName)
{
    $(formName).show();
    var value = $("#body").val();
    $("#body").val(value+$(reply).attr("data-text"));
    var url = location.href;
    location.href = "#body";
    history.replaceState(null,null,url);
}