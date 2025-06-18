/* ========= サンプル曲データ ========= */
const SAMPLE_SONGS = [
       { title: 'きらきら星', sequence: 'ド（き）ド（ら）ソ（き）ソ（ら）ラHi（ひ）ラHi（か）ソ（る）\nファ（お）ファ（そ）ミ（ら）ミ（の）レ（ほ）レ（し）ド（よ）' },
       { title: 'チューリップ', sequence: 'ド（さ）レ（い）ミ（た）ド（さ）レ（い）ミ（た）\nソ（ちゅー）ミ（りっ）レ（ぷ）ド（の）レ（は）ミ（な）レ（が）\nド（なー）レ（らん）ミ（だー）ド（なー）レ（らん）ミ（だー）\nソ（あ）ミ（か）レ（し）ド（ろ）レ（き）ミ（い）ド（ろ）\nソ（ど）ソ（の）ミ（は）ソ（な）ラHi（み）ラHi（て）ソ（も）\nミ（き）ミ（れ）レ（い）レ（だ）ド（な）' },
       { title: 'メリーさんのひつじ', sequence: 'ミレドレミミミ\nレレレミソソ\nミレドレミミミ\nミレレミレド' },
       { title: 'the enternainer', sequence: 'ミファソドHiソドHiソドHi\nドHiレHiレ♯HiミHiドHiレHiミHiシHiレHiドHi\nミファソドHiソドHiソドHi\nラHiソファ♯ラHiドHiミHiレHiドHiラHiレHi\nミファソドHiソドHiソドHi\nドHiレHiレ♯HiミHiドHiレHiミHiシHiレHiドHi\nドHiレHiミHiドHiレHiミHiドHiレHiドHiミHiドHiレHiミHi\nドHiレHiドHiミHiドHiレHiミHiシHiレHiドHi' }
    ];
    
    /* ========= サンプル曲リストの生成 ========= */
    (function buildSampleSongList() {
       const listContainer = document.getElementById('sample-song-list');
       if (!listContainer) return;
       listContainer.innerHTML = '';
    
       SAMPLE_SONGS.forEach(song => {
           const details = document.createElement('details');
           details.className = 'song-item';
    
           const summary = document.createElement('summary');
           summary.className = 'song-item-title';
           summary.textContent = song.title;
    
           const content = document.createElement('div');
           content.className = 'song-details-content';
    
           const pre = document.createElement('pre');
           pre.textContent = song.sequence;
    
           const loadLink = document.createElement('a');
           loadLink.className = 'btn';
           loadLink.textContent = 'この曲の運指を表示';
           // sequence.htmlへURLパラメータで曲データを渡す
           loadLink.href = `sequence.html?sequence=${encodeURIComponent(song.sequence)}`;
    
           content.appendChild(pre);
           content.appendChild(loadLink);
           details.appendChild(summary);
           details.appendChild(content);
           listContainer.appendChild(details);
       });
    })();