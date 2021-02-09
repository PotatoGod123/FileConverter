'use strict';


const $selectCurrentType = $('#fileSelect');


$selectCurrentType.on('change', function () {

  const selectedOption = this.value;
  const $fileTypes = $('#fileTarget option');
  $fileTypes.each(function(){
    $(this).addClass('hide');
  });
  $('#fileTarget').val($('#fileTarget').data('default-value'));
  $('#fileTarget').data('default-value',$('#fileTarget').val());

  const pngType= ['jpg','pdf','pdfa','tiff','watermark','webp'];
  const docType=['docx','html','jpg','mhtml','odt','pdf','pdfa','png','rtx','tiff','txt','webp','xps','zip'];
  const docxType=['doc','html','jpg','mhtml','odt','pdf','pdfa','png','rtx','tiff','txt','webp','xps','zip'];
  const gifType=['jpg','pdf','pdfa','tiff','zip','webp','png'];
  const htmlType=['docx','jpg','odt','pdf','png','txt','zip'];
  const jpgType=['pdf','pdfa','png','tiff','watermark','webp','zip'];
  const pdfType=['compress','decompress','decrypt','encrypt','extract','jpg','pdfa','png','pptx','repair','txt','zip','watermark'];
  const txtType=['jpg','pdf','png','tiff','webp','zip'];
  if(selectedOption==='png'){
    pngType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='doc'){
    docType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='docx'){
    docxType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='gif'||selectedOption==='jpeg'){
    gifType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='html'){
    htmlType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='jpg'){
    jpgType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='pdf'){
    pdfType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
  if(selectedOption==='txt'){
    txtType.forEach(val=>{
      $(`#${val}`).removeClass('hide');
    });
  }
});
