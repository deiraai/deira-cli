#!/usr/bin/env node
'use strict';

const vorpal = require('vorpal')();
const login = require('../src/login');
const spinner = require('../src/spinner');
const server = require('../src/server');

const chalk = vorpal.chalk;

function errorHandler (ctx, s) {
    return (e) => {
        if (s) {
            s.stop(true);
        }
        ctx.log(chalk.red(`\nError: ${e.message}`));
        if (Array.isArray(e.errors)) {
            e.errors.forEach(err => ctx.log(chalk.yellow(` ${err.dataPath}: ${err.message}`)));
        }
    };
}

vorpal
    .command('login')
    .description(chalk.blue('Sign in to application'))
    .action(function () {
        this.log('will prompt');
        let email = null;
        let password = null;
        const s = spinner();
        return this.prompt([{
            type: 'input',
            message: chalk.cyan(' What is your email? '),
            name: 'email'
        }, {
            type: 'password',
            message: chalk.cyan(' What is your password? '),
            name: 'password'
        }])
            .then((e) => {
                email = e.email;
                password = e.password;
                s.start();

                return login(email, password);
            })
            .then(() => {
                s.stop(true);
                this.log(chalk.green('Successfully signed in! Welcome!'));
            })
            .catch(errorHandler(this, s));
    });

vorpal
    .command('init')
    .description(chalk.blue('Create an empty project'))
    .action(function () {

        return server.runServer(3000)
            .then((port) => {
                this.log(chalk.green(` Listenining on port ${port}`));

            });
    });

vorpal
    .command('run')
    .description(chalk.blue('Create an empty project'))
    .action(function () {
        return server.runServer(3000)
            .then((srv) => {
                this.log(chalk.green(` Listenining on port ${srv.port}`));
                return srv.onClose();
            })
            .catch(errorHandler(this));
    });
vorpal
    .catch('[words...]', 'Catches incorrect commands')
    .action(function (args, cb) {
        if (args.words) {
            const cmd = args.words.join(' ');
            this.log(`${cmd} is not a valid command.`);
        } else {
            this.log(chalk.blue('Welcome'));
        }
        const s = spinner();
        s.start();
        setTimeout(() => {
            s.stop(true);
            cb();
        }, 2000);
    });

vorpal
    .delimiter('')
    .show()
    .parse(process.argv);

