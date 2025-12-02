import chalk from "chalk";

/**
 * Logger class for Harmonix framework.
 * Provides nicely formatted and colored logs in the console.
 *
 * Example usage:
 * ```ts
 * import { Logger, Status } from "harmonix";
 * 
 * const logger = new Logger();
 * 
 * logger.sendLog(Status.SUCCESS, "Bot started successfully!");
 * logger.sendLog(Status.WARNING, "This is a warning message!");
 * logger.sendLog(Status.ERROR, "An error occurred.");
 * logger.sendLog("INFO", "Some informational message");
 * 
 * console.log(logger.getLog(Status.SUCCESS, "This is a formatted log string"));
 * ```
 */
export class Logger {
    /**
     * Returns the current date and time formatted as [YYYY-M-D | H:M:S]
     * with white color using chalk.
     */
    getDateFormat(): string {
        const nowDate = new Date();
        let format = [
            `[${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`,
            `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}]`
        ]
        return chalk.white(format.join(" | "))
    }

    /**
     * Returns a formatted log string with color depending on status.
     * @param status - Status as string or Status enum
     * @param message - The message to log
     * @returns Formatted and colored string
     */
    getLog(status: string | Status, message: string): string {
        const statusEnum = typeof status === "string" ? Status[status] : status;
        switch (statusEnum) {
            case Status.SUCCESS:
                return `${this.getDateFormat()} ${chalk.green(message)}`;
            case Status.WARNING:
                return `${this.getDateFormat()} ${chalk.yellow(message)}`;
            case Status.ERROR:
                return `${this.getDateFormat()} ${chalk.red(message)}`;
            default:
                return `${this.getDateFormat()} ${chalk.blue(message)}`;
        }
    }

    /**
     * Sends a formatted log message directly to the console.
     * @param status - Status as string or Status enum
     * @param message - The message to log
     */
    sendLog(status: string | Status, message: string): void {
        const statusEnum = typeof status === "string" ? Status[status] : status;
        switch (statusEnum) {
            case Status.SUCCESS:
                return console.log(`${this.getDateFormat()} ${chalk.green(message)}`);
            case Status.WARNING:
                return console.log(`${this.getDateFormat()} ${chalk.yellow(message)}`);
            case Status.ERROR:
                return console.log(`${this.getDateFormat()} ${chalk.red(message)}`);
            default:
                return console.log(`${this.getDateFormat()} ${chalk.blue(message)}`);
        }
    }
    
}

/**
 * Enum representing different log statuses.
 * Used by Logger to format messages.
 */
export enum Status {
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR",
}