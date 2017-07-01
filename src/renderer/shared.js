function Translation() {
  this.short_name = ''
  this.full_name = ''
  this.app_name = ''
  this.app_name_error = ''
  this.short_descr = ''
  this.short_descr_error = ''
  this.long_descr = ''
  this.long_descr_error = ''
  this.text = ''
  this.text_error = ''
  this.gpc_name = ''
}

function Lang(short_name, full_name, gpc_name, selected) {
  this.short_name = short_name
  this.full_name = full_name
  this.gpc_name = gpc_name
  this.selected = selected
}

export {Translation, Lang}