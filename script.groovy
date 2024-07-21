String get_new_version(String cfv) {
    def parts = cfv.split('\\.')
    
    
    def lastPart = parts[-1] as Integer
    
    
    parts[-1] = (lastPart + 1).toString()
    

    def newVersion = parts.join('.')
    
    return newVersion
}

return this