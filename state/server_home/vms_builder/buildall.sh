#!/bin/bash
#
# Build all our images for kvm and vbox31

if [ $# -lt 2 ]; then
	echo "Usage: $0 mig_shared_dir mig_state_vms_builder_dir"
	exit 1
fi

# Change run to 'echo' to only show commands for partial manual runs
#run='echo'
run=''

cwd=$PWD
shared_dir="$1"
builder_dir=$2

lookup_version() {
	flavors=('lucid' 'maverick' 'natty' 'oneiric' 'precise')
	versions=('10.04' '10.10' '11.04' '11.10' '12.04')
	count=${#flavors[@]}
	index=0
	name="$1"
	while [ "$index" -lt "$count" ]; do
		cur="${flavors[$index]}"
		if [ "$name" = "$cur" ]; then
			version="${versions[$index]}"
			#echo  "found version: $version"
			break
		fi
		let "index++"
	done
	export version
}

for flavor in lucid precise; do
	# lookup version number from flavor
	flavorindex=0
	version=''
	lookup_version $flavor
	for arch in i386 amd64; do
		label="basic"
		$run echo "build ubuntu $flavor $label image for $arch"
		$run cd $shared_dir
		$run python vmbuilder.py --suite=$flavor --hypervisor=kvm \
			--vmbuilder-opts='' --architecture=$arch
		$run cd $builder_dir
		$run ./tmp2kvm.sh $arch 'basic' $version $flavor
		label="escience-base"
		$run echo "build ubuntu $flavor $label image for $arch"
		$run cd $shared_dir
		$run python vmbuilder.py --suite=$flavor --hypervisor=kvm \
			--vmbuilder-opts='' --architecture=$arch \
			libatlas3gf-base python-scipy python-matplotlib \
			ipython	python-imaging python-pip
		$run cd $builder_dir
		$run ./tmp2kvm.sh $arch 'escience-base' $version $flavor
		label="escience-astro"
		$run echo "build ubuntu $flavor $label image for $arch"
		$run cd $shared_dir
		# TODO: add mysql python-pywcs stsci_python where available
		# python-pywcs is available in precise and on this PPA
		# https://launchpad.net/~olebole/+archive/astro
		$run python vmbuilder.py --suite=$flavor --hypervisor=kvm \
			--vmbuilder-opts='' --architecture=$arch \
			libatlas3gf-base python-scipy python-matplotlib \
			ipython python-imaging python-pip \
			sqlite3 python-sqlalchemy python-pyfits 
		$run cd $builder_dir
		$run ./tmp2kvm.sh $arch 'escience-base' $version $flavor
	done
done

# Convert all images to vbox31 format
$run cd $builder_dir
$run ./kvm2vbox.sh

# Copy all data images to separate dirs for flexible packaging
$run cd $builder_dir
$run ./clonedataimg.sh

$run cd $cwd
exit 0
