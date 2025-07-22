<?php

$tar_file = __DIR__.'/dist.tar.gz';
$extract_to = __DIR__.'/';

run_command("tar -xzf $tar_file -C $extract_to");
// run_command('cp -f ../.env.production ../.env');
run_command('cp -f ../htaccess.example ../.htaccess');
// run_command('rm -f ./.ftp-deploy-sync-state.json');
run_command("rm -f $tar_file");
run_command("rm -rf ./deploy");
exit('Deployment script successfully executed');

function run_command($command)
{
    exec($command, $output, $return_code);

    if ($return_code != 0) {
        exit('<pre>'.print_r([$command, $output, $return_code], true).'</pre>');
    }
}
