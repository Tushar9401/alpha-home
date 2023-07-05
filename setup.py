from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in alpha/__init__.py
from alpha import __version__ as version

setup(
	name="alpha",
	version=version,
	description="el",
	author="t",
	author_email="t",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
