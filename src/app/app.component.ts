// @ts-ignore: Object is possibly 'null'.

import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'range';
  feedContent : any = null;
  mentionConfig: any;
  connList = [
    {fullName: 'Test', sourceType: 'COMPANY', profileTitle:'Hello', redirectUri: "<a href=/authverifly?route=/overview/working-at-Luceco?Inc-B27293  target=_blank style=color:blue; contenteditable=false value=@105103 ><b>  Luceco Inc </b></a>"
  }
  ];
  conns:any;
  constructor(
    @Inject(DOCUMENT) private CustomDocument: Document 
  ){}

  ngOnInit(){
    this.showMentionSuggestions();
  }

  setCaretPosition(id: string){
    const el = document.getElementById(id);  
    const selection = window.getSelection();  
    const range = document.createRange();  
    selection!.removeAllRanges();  
    range.selectNodeContents(el!);  
    range.collapse(false);  
    selection!.addRange(range);  
    el!.focus();
  }

  public insertSpanText(name: any) {
    return `
      <span
        class="mention"
        contenteditable="false"
        >${name.fullName}</span>&nbsp;
    `;
  }
  pasteHtmlAtCaret(html: string) {

    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if ( sel!.rangeCount) {
            range = sel!.getRangeAt(0);
            range.deleteContents();
    //         var test = document.getElementById("createContent");
    // const regex = /@/g;
    // test!.innerHTML = test!.innerHTML.replace(regex, '-');
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel!.removeAllRanges();
                sel!.addRange(range);
            }
            
              
        }
    } 
    // else if (document.selection && document.selection.type != "Control") {
    //     // IE < 9
    //     document.selection.createRange().pasteHTML(html);
    // }
}
  showMentionSuggestions(){
    this.mentionConfig = {
      mentions: [
        {
            items: this.connList,
            insertHTML: true,
            triggerChar: '@',
            mentionSelect: (item: any) => this.pasteHtmlAtCaret('<a contentEditable="false">Hello</a>'),
            // mentionSelect: (item: any)=>{
            //   var sel, range;
            //   if (window.getSelection) {
            //       sel = window.getSelection();
            //       if (sel) {
            //           range = sel!.getRangeAt(0);
            //           console.log('range at 0:', range);
            //           range.deleteContents();
            //           console.log('range after delete content', range);
            //           var el = document.createElement("span");
            //           document.getElementById('createContent')!.appendChild(el);
            //           el.innerHTML = item.redirectUri;
            //           var frag = document.createDocumentFragment(), node, lastNode;
            //           while ( (node = el.firstChild) ) {
            //             console.log('node:', node);
            //               lastNode = frag.appendChild(node);
            //           }
            //           console.log('last node', lastNode);
            //           var textnode = document.createTextNode(" ");
            //           range.insertNode(frag);
            //           console.log('fragment', frag);
            //           console.log(range.toString());
            //           if (lastNode) {
            //               range = range.cloneRange();
            //               range.setStartAfter(lastNode);
                         
            //               range.collapse(true);
            //               sel!.removeAllRanges();
            //               sel!.addRange(range);
            //               // this.setCaretPosition()
            //               el.focus();
            //           }
            //       }
            //   }
            //   var test = this.CustomDocument.getElementById("createContent");
            //   const regex = /@/gi;
            //   test!.innerHTML = test!.innerHTML.replace(regex, '');
            //   this.setCaretToEnd(el!);
            // },
            labelKey: 'fullName',
            maxItems: 5,
            disableSearch: false
        }
      ],
    };
    // console.log('MENRIKN', this.mentionConfig);
  }

  // setCaretPosition(elemId: string, caretPos: Number) {
  //   var elem = document.getElementById(elemId);

  //   if(elem != null) {
  //       if(elem.createTextRange) {
  //           var range = elem.createTextRange();
  //           range.move('character', caretPos);
  //           range.select();
  //       }
  //       else {
  //           if(elem.selectionStart) {
  //               elem.focus();
  //               elem.setSelectionRange(caretPos, caretPos);
  //           }
  //           else
  //               elem.focus();
  //       }
  //   }
  // }
  setCaretToEnd(target : HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false);
    sel!.removeAllRanges();
    sel!.addRange(range);
    target.focus();
    range.detach(); // optimization
  
    // set scroll to the end if multiline
    target.scrollTop = target.scrollHeight; 
  }


  searchTermFunc(term: any) {
    this.conns.getAllUsersandCompanies(term).subscribe( (res:any) => {
      if (res.status == "SUCCESS") {
        this.connList = res.map.fields || [];
        this.mentionConfig = {
          mentions: [
            {
                items: this.connList,
                triggerChar: '@',
                mentionSelect: (item : any)=>{
                  // return ` ${item.redirectUri} `
                  var sel, range;
                  if (window.getSelection) {
                      // console.log(window.getSelection());
                      sel = window.getSelection();
                      if (sel!.getRangeAt(0) && sel!.rangeCount) {
                          range = sel!.getRangeAt(0);
                          range.deleteContents();
                          var el = document.createElement("span");
                          el.innerHTML = item.redirectUri;
                          var frag = document.createDocumentFragment(), node, lastNode;
                          while ( (node = el.firstChild) ) {
                              lastNode = frag.appendChild(node);
                          }
                          var textnode = document.createTextNode(" ");
                          range.insertNode(frag);
                          
                          if (lastNode) {
                              range = range.cloneRange();
                              range.setStartAfter(lastNode);
                              range.collapse(true);
                              sel!.removeAllRanges();
                              sel!.addRange(range);
                          }
                      }
                  }
                  var test = this.CustomDocument.getElementById("createContent");
                  // console.log('searchTerm',test.innerHTML);
                  const regex = /@/gi;
                  test!.innerHTML = test!.innerHTML.replace(`@${term}`, '').replace(regex,'');
                },
                insertHTML: true,
                labelKey: 'fullName',
                maxItems: 10, 
                disableSearch: false
            }
          ], 
        };
      }
    });
  }

  checkText(event: any) {
    if (event.keyCode == 8) {
      let list = event.target.children;
      // for (var i = 0; i < event.target.childNodes.length; i++) {
        if( event.target.lastElementChild && event.target.lastChild.nodeName === 'A') {
          let selection = window.getSelection();
          var test = this.CustomDocument.getElementById("createContent");
          //test!.innerHTML = test!.innerHTML.replace(`${selection!.focusNode!.data}`, '');
          test!.removeChild(event.target.lastElementChild);
        }
      // }
      // for (var i = 0; i < event.target.children.length; i++) {
      //   // console.log('EACH IN LIST: ', list[i]);
      //   if (list[i].origin === "https://www.gradsiren.com") {
      //     let selection = window.getSelection();
      //     // console.log('SELECTION IN LIST: ', selection);
      //     var test = this.CustomDocument.getElementById("createContent");
      //     test.innerHTML = test.innerHTML.replace(`${selection.focusNode['data']}`, '');
      //   }
      // }
    }
  }

  removeSpecialChar(event: any){
    // var select = window!.getSelection()!.anchorNode!.parentNode;
    // var el = angular!.element( select );

    // if ( event.which === 8 && $scope.peopleList.length > 0 && el.hasClass( 'mention' ) ) {
    //     select.parentNode.removeChild( select );
    // }
  }

}
