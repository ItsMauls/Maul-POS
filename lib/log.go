package lib

import (
	"fmt"
	"log"
	"os"
)

type AggregateLogger struct {
	infoLogger  *log.Logger
	errLogger   *log.Logger
	warnLogger  *log.Logger
	debugLogger *log.Logger
	fatalLogger *log.Logger
}

func NewAggregateLogger(config AppConfig) *AggregateLogger {
	infoLogger := log.New(os.Stdout, config.Name+" INFO", log.Ldate|log.Ltime|log.Lshortfile)
	errLogger := log.New(os.Stdout, config.Name+" ERROR", log.Ldate|log.Ltime|log.Lshortfile)
	warnLogger := log.New(os.Stdout, config.Name+" WARN", log.Ldate|log.Ltime|log.Lshortfile)
	debugLogger := log.New(os.Stdout, config.Name+" DEBUG", log.Ldate|log.Ltime|log.Lshortfile)
	fatalLogger := log.New(os.Stdout, config.Name+" FATAL", log.Ldate|log.Ltime|log.Lshortfile)

	return &AggregateLogger{
		infoLogger:  infoLogger,
		errLogger:   errLogger,
		warnLogger:  warnLogger,
		debugLogger: debugLogger,
		fatalLogger: fatalLogger,
	}
}

func (a *AggregateLogger) Info(v ...interface{}) {
	a.infoLogger.Println(v...)
}

func (a *AggregateLogger) InfoF(format string, v ...interface{}) {
	a.infoLogger.Printf(format, v...)
}

func (a *AggregateLogger) Error(v ...interface{}) {
	a.errLogger.Println(v...)
}

func (a *AggregateLogger) ErrorF(format string, v ...interface{}) {
	a.errLogger.Printf(format, v...)
}

func (a *AggregateLogger) Warn(v ...interface{}) {
	a.warnLogger.Println(v...)
}

func (a *AggregateLogger) WarnF(format string, v ...interface{}) {
	a.warnLogger.Printf(format, v...)
}

func (a *AggregateLogger) Debug(v ...interface{}) {
	a.debugLogger.Println(v...)
}

func (a *AggregateLogger) DebugF(format string, v ...interface{}) {
	a.debugLogger.Printf(format, v...)
}

func (a *AggregateLogger) Fatal(v ...interface{}) {
	a.fatalLogger.Println(v...)
}

func (a *AggregateLogger) FatalF(format string, v ...interface{}) {
	a.fatalLogger.Fatalf(format, v...)
}

func (a *AggregateLogger) InfoWithCtx(ctx string, v ...interface{}) {
	msg := fmt.Sprintf("%s: %v", ctx, v)
	a.infoLogger.Println(msg)
}
