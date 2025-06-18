/* ========= サンプル曲データ ========= */
const SAMPLE_SONGS = [
       { title: 'きらきら星', sequence: 'ドドソソララソ\nファファミミレレド' },
       { title: 'チューリップ', sequence: 'ドレミドレミ\nソミレドレミレド' },
       { title: 'メリーさんのひつじ', sequence: 'ミレドレミミミ\nレレレミソソ\nミレドレミミミ\nミレレミレド' },
       { title: 'エリーゼのために', sequence: 'みれ♯みれ♯みしれどら　どみらし　みどしら' },
       { title: 'the enternainer', sequence: 'EFGC2GC2GC2C2D2E♭2E2C2D2E2B2D2C2\nEFGC2GC2GC2A2GG♭A2C2E2D2C2A2D2\nEFGC2GC2GC2C2D2E♭2E2C2D2E2B2D2C2\nC2D2E2C2D2E2C2D2C2E2C2D2E2C2D2C2E2C2D2E2B2D2C2' },
       { title: '冬', sequence: 'どそふぁみれどれそそふぁみれどしふぁふぁみ' },
       { title: '春', sequence: 'そみみみれどそそふぁみみれどそそふぁみふぁそふぁみれしそ' },
       { title: 'エリーゼのために', sequence: 'ミファソド2ソド2ソド2ド2レ2ミ♭2ミ2ド2レ2ミ2シ2レ2ド2\n\nミファソド2\nソド2ソド2\n\nラ2ソソ♭ラ2ド2ミ2レ2ド2ラ2レ2\n\nミファソド2ソド2ソド2\nド2レ2ミ♭2ミ2\nド2レ2ミ2シ2レ2ド2\n\nド2レ2ミ2ド2レ2ミ2\nド2レ2ド2ミ2ド2レ2ミ2\nド2レ2ド2ミ2ド2レ2ミ2\nシ2レ2ド2' },
       { title: 'メリーさんのひつじ', sequence: 'ミレドレミミミ\nレレレミソソ\nミレドレミミミ\nミレレミレド' },
       { title: 'エリーゼのために', sequence: 'みれ♯みれ♯みしれどら　どみらし　みどしら' },
       { title: 'メリーさんのひつじ', sequence: 'ミレドレミミミ\nレレレミソソ\nミレドレミミミ\nミレレミレド' },
       { title: 'エリーゼのために', sequence: 'みれ♯みれ♯みしれどら　どみらし　みどしら' },
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