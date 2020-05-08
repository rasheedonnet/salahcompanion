window.onload = function(){
    var myAudio = document.createElement('audio');
    var audioSourceBaseUrl = 'https://everyayah.com/data/';
    const surahJson = 'data/surah.json';

    let firstSurahSelect = $('#first-surah-list');
    let firstSurahSelectFrom = $('#first-surah-list-start');
    let firstSurahSelectTo = $('#first-surah-list-end');
    let secondSurahSelect = $('#second-surah-list');
    let secondSurahSelectFrom = $('#second-surah-list-start');
    let secondSurahSelectTo = $('#second-surah-list-end');
    let niyathTime = $('#list-niyath-time');
    let rukuTime = $('#list-ruku-time');
    let recitation = $('#list-recitation');

    initializePage();

    beginSalah = function() { 
        $('#beginSalahBtn').prop('disabled', true);
        audioSourceBaseUrl = audioSourceBaseUrl + recitation.val() + "/";
        var playlist = createPlaylist();
        i = 0;
        //var playlist = new Array('001000.mp3', 'audio/500MilSecSilence.mp3','001001.mp3', '001002.mp3','001003.mp3','001004.mp3','001005.mp3','001006.mp3','001007.mp3');

        myAudio.addEventListener('ended', function () {
            i = ++i;
            if(i == playlist.length){
                myAudio.pause();
                $('#beginSalahBtn').prop('disabled', false);
                return;
            }
            
            console.log(i)
            if(playlist[i].includes("/")>0){
                myAudio.src = playlist[i];
            }
            else{
                myAudio.src = audioSourceBaseUrl + playlist[i];
            }
            myAudio.play();
        }, true);
        myAudio.loop = false;
        if(playlist[0].includes("/")>0){
            myAudio.src = playlist[0];
        }
        else{
            myAudio.src = audioSourceBaseUrl + playlist[0];
        }
        //myAudio.src = audioSourceBaseUrl + playlist[0];
        myAudio.play();
    }
    
    function initializePage()
    {
        firstSurahSelect.empty();
        firstSurahSelect.append('<option selected="true" disabled>Select Surah</option>');
        firstSurahSelect.prop('selectedIndex', 0);
        secondSurahSelect.empty();
        secondSurahSelect.append('<option selected="true" disabled>Select Surah</option>');
        secondSurahSelect.prop('selectedIndex', 0);
        
        niyathTime.empty();
        rukuTime.empty();

        for(i=1;i<=20;i++){
            rukuTime.append($('<option></option>').attr('value', i).text(i));
            niyathTime.append($('<option></option>').attr('value', i).text(i));
        }

        // Populate dropdown with list of suras
        $.getJSON(surahJson, function (data) {
            $.each(data.quran.suras.sura, function (key, entry) {
                var displaySurah = entry.index + '.' + entry.tname + ' (' + entry.name + ')';
                firstSurahSelect.append($('<option></option>').attr('value', entry.index).text(displaySurah));
                secondSurahSelect.append($('<option></option>').attr('value', entry.index).text(displaySurah));
            })
        });
    }

    
    $("#first-surah-list").change(function() {
        $.getJSON(surahJson, function (data) {
            firstSurahSelectFrom.empty();
            firstSurahSelectTo.empty();
            $.each(data.quran.suras.sura, function (key, entry) {
                if(entry.index == $("#first-surah-list").val()){
                    for(i=1;i<entry.ayas;i++){
                        firstSurahSelectFrom.append($('<option></option>').attr('value', i).text(i));
                        firstSurahSelectTo.append($('<option></option>').attr('value', i).text(i));
                    }
                }
                
            })
        });
      });

    
    
    $("#second-surah-list").change(function() {
        $.getJSON(surahJson, function (data) {
            secondSurahSelectFrom.empty();
            secondSurahSelectTo.empty();
            $.each(data.quran.suras.sura, function (key, entry) {
                if(entry.index == $("#second-surah-list").val()){
                    for(i=1;i<entry.ayas;i++){
                        secondSurahSelectFrom.append($('<option></option>').attr('value', i).text(i));
                        secondSurahSelectTo.append($('<option></option>').attr('value', i).text(i));
                    }
                }
                
            })
        });
      });
    function createPlaylist()
    {
        var awudhuBillah = '001000.mp3';
        var bismillah = '001001.mp3';
        var niyath = [];
        for (i=1;i<=(niyathTime.val()*2);i++){
            niyath.push('audio/500MilSecSilence.mp3');
        }
        var suraFathiha = new Array(awudhuBillah, bismillah, '001002.mp3','001003.mp3','001004.mp3','001005.mp3','001006.mp3','001007.mp3');
        var firstRakath = new Array(bismillah);
        for (i=firstSurahSelectFrom.val();i<=firstSurahSelectTo.val();i++){
            firstRakath.push(prependZero(firstSurahSelect.val()) + prependZero(i) + '.mp3')
        }
        var ruku = [];
        for (i=1;i<=(rukuTime.val()*2);i++){
            ruku.push('audio/500MilSecSilence.mp3');
        }
        var secondRakath = new Array(bismillah);
        for (i=secondSurahSelectFrom.val();i<=secondSurahSelectTo.val();i++){
            secondRakath.push(prependZero(secondSurahSelect.val()) + prependZero(i) + '.mp3')
        }
        var playList = niyath.concat(suraFathiha).concat(firstRakath).concat(ruku).concat(suraFathiha).concat(secondRakath);
        return playList;
    }
    function prependZero(number) {
        if (number < 9){
            return "00" + number;
        }
        else if (number > 9 && number < 99) {
            return "0" + number;
        } 
        else{
            return number;
        }
    }
}