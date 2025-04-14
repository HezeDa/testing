const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
}

class Logger {
  private static instance: Logger
  private isDebug: boolean

  private constructor() {
    this.isDebug = process.env.NODE_ENV === 'development'
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(type: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString()
    const formattedArgs = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ')
    
    return `${colors.cyan}[${timestamp}] ${colors.bright}${type}${colors.reset}: ${message} ${formattedArgs}`
  }

  public debug(message: string, ...args: any[]) {
    if (this.isDebug) {
      console.debug(this.formatMessage('DEBUG', message, ...args))
    }
  }

  public info(message: string, ...args: any[]) {
    console.info(this.formatMessage('INFO', message, ...args))
  }

  public warn(message: string, ...args: any[]) {
    console.warn(this.formatMessage('WARN', message, ...args))
  }

  public error(message: string, ...args: any[]) {
    console.error(this.formatMessage('ERROR', message, ...args))
  }

  public logRoute(route: string, params: any) {
    this.debug(`Route: ${route}`, params)
  }

  public logApiCall(method: string, path: string, params: any) {
    this.debug(`API ${method}: ${path}`, params)
  }

  public logDatabaseQuery(query: string, params: any[]) {
    this.debug('Database Query:', { query, params })
  }
}

export const logger = Logger.getInstance() 