<?php

$root_dir = realpath(__DIR__ . "/..");
$current_dir = realpath(__DIR__);
$tar_file = "$root_dir/dist.tar.gz";
$tar_file_name = basename($tar_file);
$backup_dir = $root_dir . '/' . time() . '_recent_backup';
$backup_dir_name = basename($backup_dir);

run_command("rsync -a --exclude='deploy' --exclude='$tar_file_name' --exclude='$backup_dir_name' \"$root_dir/\" \"$backup_dir/\"");
run_command("tar -xzf \"$tar_file\" -C \"$root_dir\"");
// run_command("cp -f $root_dir/.env.production $root_dir/.env");
run_command("cp -f \"$current_dir/htaccess.example\" \"$root_dir/.htaccess\"");
// run_command("rm -f $root_dir/.ftp-deploy-sync-state.json");
run_command("rm -f \"$tar_file\"");
register_shutdown_function(function () {
    run_command("rm -rf \"$current_dir\"");
});
exit('Deployment script successfully executed');

function run_command($command)
{
    exec($command, $output, $return_code);

    if ($return_code != 0) {
        exit('<pre>'.print_r([$command, $output, $return_code], true).'</pre>');
    }
}
