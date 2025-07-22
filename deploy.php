<?php

$tar_file = __DIR__.'/project.tar.gz';
$extract_to = __DIR__.'/';

run_command("tar -xf $tar_file -C $extract_to");
// run_command('cp -f ../.env.production ../.env');
run_command('cp -f ../htaccess.example ../.htaccess');
run_command('rm -f ./.ftp-deploy-sync-state.json');
run_command('rm -f ./deploy.php');
exit('Deployment script successfully executed');

function run_command($command)
{
    exec($command, $output, $return_code);

    if ($return_code != 0) {
        exit('<pre>'.print_r([$command, $output, $return_code], true).'</pre>');
    }
}
